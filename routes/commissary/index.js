// Importing ExpressJS
const express = require("express");

// Importing Router() from express
const router = express.Router();

// Importing Middlewares
const authenticationMiddleware = require("../../middlewares/authenticationMiddleware");
// const domainValidatorMiddleware = require("../middlewares/domainValidatorMiddleware");
// const blogPostRouterBodySanitizer = require("../middlewares/blogPostRouterBodySanitizer");

// Importing Controllers
const {
  getAllData,
  createData,
  updateData,
  deleteData,
  storeDelivery,
} = require("../../controllers/commissary");

router.get(
  "/",
  //   domainValidatorMiddleware,
  //   authenticationMiddleware,
  getAllData
);

router.post(
  "/",
  //   domainValidatorMiddleware,
  //   authenticationMiddleware,
  createData
);

router.patch(
  "/:id",
  //   domainValidatorMiddleware,
  //   authenticationMiddleware,
  updateData
);

router.delete(
  "/:id",
  //   domainValidatorMiddleware,
  //   authenticationMiddleware,
  deleteData
);

router.post(
  "/delivery",
  //   domainValidatorMiddleware,
  //   authenticationMiddleware,
  storeDelivery
);

module.exports = router;
