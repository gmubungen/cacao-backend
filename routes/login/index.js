// Importing ExpressJS
const express = require("express");

// Importing Router() from express
const router = express.Router();

// Importing Middlewares

// Importing Controllers
const { userLogin, employeeLogin } = require("../../controllers/login");

router.post("/user-login", userLogin);

router.post("/employee-login", employeeLogin);

module.exports = router;
