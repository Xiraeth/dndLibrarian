const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", function (req, res, next) {
  const errorMessage =
    req.query.error === "invalid" ? "Invalid username or password" : null;
  res.render("login", { title: "Log in", error: errorMessage });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=invalid",
  })
);

module.exports = router;
