const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const characterController = require("../controllers/characterController");

/* GET home page. */
router.get("/", userController.renderHomePage);

module.exports = router;
