const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  const errorMessage =
    req.query.error === "invalid" ? "Invalid username or password" : null;
  res.render("login", { title: "Log in", error: errorMessage });
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return next(err);
    }

    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.redirect("/login?error=invalid");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Session error:", err);
        return next(err);
      }
      console.log("User logged in successfully:", user.username);
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
