// importing dotenv
require("dotenv").config();

// Importing Express Sanitizer
const expressSanitizer = require("express-sanitizer");

// Importing ExpressJS
const express = require("express");

// // Importing Path
// const path = require("path");

// Assigning express function into variable app
const app = express();

// Importing Body Parser
const bodyParser = require("body-parser");

// Routes
const router = require("./routes");

// Setting maximum limit of body size
app.use(bodyParser.json({ limit: "50mb" }));

// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Mount express-sanitizer middleware here
app.use(expressSanitizer());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Removed X-Powered-By on Header
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

// app.set("views", path.join(__dirname, "html"));
// app.set("view engine", "ejs");

// Server port
const port = process.env.PORT;

// Created listener on the declared port
const server = app.listen(port || 3000);

// Set Timeout to 30 mins
server.timeout = 1800000;

// Log to terminal to make sure the server is running
console.log("Listening to Port 3000");

// Mounting router on app variable to make initialise routing
app.use("/", router);
