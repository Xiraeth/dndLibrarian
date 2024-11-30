const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");

router.get("/:id", characterController.get_editCharacter);

router.post("/:id", characterController.post_editCharacter);

module.exports = router;
