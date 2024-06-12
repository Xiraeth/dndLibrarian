const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.createUser = [
  body("username", "Username field cannot be empty")
    .trim()
    .custom(async (value, { req }) => {
      if (value.length > 16) {
        throw new Error("Username cannot be more than 16 characters long");
      }

      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error("Username is already taken");
      }
      return true;
    })
    .escape(),
  body("password", "Password field cannot be empty").trim().escape(),
  body("passConfirm", "Passwords don't match")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        if (!errors.isEmpty()) {
          res.render("signup", {
            title: "Sign up",
            user: user,
            errors: errors.array(),
          });
        } else {
          // Implement create_user and log in
          await user.save();
          res.redirect("/");
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.get_createCharacter = asyncHandler(async (req, res, next) => {
  res.render("createCharacter", { title: "Character creation" });
});

exports.post_createCharacter = [
  body("dndName", "Name cannot be empty")
    .trim()
    .isLength({ min: 1, max: 16 })
    .escape(),
  body("dndClass", "Class field cannot be blank").escape(),
  body("dndRace", "Race field cannot be blank").escape(),
  body("dndBackground", "Background field cannot be blank").escape(),
];
