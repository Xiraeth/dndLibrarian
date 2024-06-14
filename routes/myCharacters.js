const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const characterController = require("../controllers/characterController");

router.get("/", characterController.renderCharacters);

module.exports = router;
