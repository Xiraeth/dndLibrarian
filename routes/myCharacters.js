const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const characterController = require("../controllers/characterController");

// router.get("/", characterController.renderCharacters);

router.get("/:id", characterController.renderCharacter);

module.exports = router;
