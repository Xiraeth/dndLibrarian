const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");

router.post("/:id", characterController.post_deleteCharacter);

module.exports = router;
