// Importing ExpressJS
const express = require("express");

// Importing Router() from express
const router = express.Router();

const actionsRoutes = require("./actions");
const devicesRoutes = require("./devices");
const employeesRoutes = require("./employees");
const ingredientsRoutes = require("./ingredients");
const ingredientsInventoryRoutes = require("./ingredients_inventory");
const loginRoutes = require("./login");
const pagesRoutes = require("./pages");
const productsRoutes = require("./products");
const rolesRoutes = require("./roles");
const storeRolesRoutes = require("./store_roles");
const storesRoutes = require("./stores");
const typeOfMeasurementsRoutes = require("./type_of_measurements");

// Creating API extension and mounting router to itself for using middlewares
router.use("/actions", actionsRoutes);
router.use("/devices", devicesRoutes);
router.use("/employees", employeesRoutes);
router.use("/ingredients", ingredientsRoutes);
router.use("/ingredients-inventory", ingredientsInventoryRoutes);
router.use("/login", loginRoutes);
router.use("/pages", pagesRoutes);
router.use("/products", productsRoutes);
router.use("/roles", rolesRoutes);
router.use("/store-roles", storeRolesRoutes);
router.use("/stores", storesRoutes);
router.use("/type-of-measurements", typeOfMeasurementsRoutes);

module.exports = router;
