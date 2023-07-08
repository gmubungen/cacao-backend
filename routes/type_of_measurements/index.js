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
  getSpecificData,
  createData,
  updateData,
  deleteData,
} = require("../../controllers/type_of_measurements");

router.get(
  "/",
  //   domainValidatorMiddleware,
  authenticationMiddleware,
  getAllData
);

router.get(
  "/:id",
  //   domainValidatorMiddleware,
  //   blogPostRouterBodySanitizer,
  authenticationMiddleware,
  getSpecificData
);

router.post(
  "/",
  //   domainValidatorMiddleware,
  //   blogPostRouterBodySanitizer,
  authenticationMiddleware,
  createData
);

router.patch(
  "/:id",
  //   domainValidatorMiddleware,
  //   blogPostRouterBodySanitizer,
  authenticationMiddleware,
  updateData
);

router.delete(
  "/:id",
  //   domainValidatorMiddleware,
  //   blogPostRouterBodySanitizer,
  authenticationMiddleware,
  deleteData
);

module.exports = router;
