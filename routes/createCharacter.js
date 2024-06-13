const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");

router.get("/", characterController.get_createCharacter);

router.post("/", characterController.post_createCharacter);

module.exports = router;
