// Importing ExpressJS
const express = require("express");

// Importing Router() from express
const router = express.Router();

// Importing Middlewares

// Importing Controllers
const { userLogin } = require("../../controllers/login");

router.post("/", userLogin);

module.exports = router;