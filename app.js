const createError = require("http-errors");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bcrypt = require("bcryptjs");
const compression = require("compression");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const logoutRouter = require("./routes/logout");
const myCharactersRouter = require("./routes/myCharacters");
const createCharacterRouter = require("./routes/createCharacter");
const deleteCharacterRouter = require("./routes/deleteCharacter");
const editCharacterRouter = require("./routes/editCharacter");

require("dotenv").config();

const app = express();

const User = require("./models/user");

// Connect to db
mongoose.set("strictQuery", false);
const mongoDbUrl = process.env.DB_URI;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    connectTimeoutMS: 10000, // Give up initial connection after 10s
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log("MongoDB URI:", process.env.MONGODB_URI); // This will help debug the connection string
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// passport session setup
// Update session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // Session TTL in seconds (1 day)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// create currentUser variable to use in pug files
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.currentCharacter = req.character;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

// using routers
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/myCharacters", myCharactersRouter);
app.use("/createCharacter", createCharacterRouter);
app.use("/editCharacter", editCharacterRouter);
app.use("/deleteCharacter", deleteCharacterRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
