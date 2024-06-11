const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("myCharacters", { title: "My Characters" });
});

module.exports = router;
