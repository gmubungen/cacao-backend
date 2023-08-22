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
  changePassword,
  assignEmployees,
} = require("../../controllers/employees");

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

router.patch("/:id", authenticationMiddleware, changePassword);

router.post(
  "/assign-employees-in-store",
  //   domainValidatorMiddleware,
  //   blogPostRouterBodySanitizer,
  authenticationMiddleware,
  assignEmployees
);

module.exports = router;
