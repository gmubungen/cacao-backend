"use strict";

const { sequelize } = require("../../sequelize");

const { QueryTypes } = require("sequelize");

const moment = require("moment");

module.exports = {
  getAllData: async (req, res) => {
    const { limit, offset } = req.query;

    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    try {
      const getAllData = await sequelize.query(
        `SELECT devices.id as id, devices.serial_no as serial_no, devices.store_id as store_id, stores.name as store_name
         FROM public.devices INNER JOIN stores ON devices.store_id = stores.id ORDER BY devices.created_datetime DESC${
           limit && offset ? ` LIMIT ${limit} OFFSET ${offset}` : ""
         };`,
        {
          type: QueryTypes.SELECT,
        }
      );

      const getCount = await sequelize.query(
        `SELECT COUNT(id) FROM public.devices;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Computation of Number of Pages
      const pageCount = Math.ceil(parseInt(getCount[0].count) / limit);

      return res.status(200).json({
        data: getAllData,
        count: parseInt(getCount[0].count),
        pageCount: pageCount ? pageCount : 0,
        message: "success",
        status: 1,
      });
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  getSpecificData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;

    try {
      const getSpecificData = await sequelize.query(
        `SELECT * FROM public.devices WHERE id = $id;`,
        {
          bind: { id },
          type: QueryTypes.SELECT,
        }
      );

      if (getSpecificData.length === 0) {
        return res.status(404).json({
          message: "Item not found in database.",
          status: 0,
        });
      }

      return res.status(200).json(getSpecificData[0]);
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  createData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { serial_no, store_id } = req.body;

    try {
      await sequelize.query(
        `INSERT INTO public.devices (id, serial_no, store_id, created_datetime, updated_datetime)
         VALUES (gen_random_uuid(), $serial_no, $store_id, $created_datetime, $updated_datetime) RETURNING *;`,
        {
          bind: {
            serial_no,
            store_id,
            created_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          type: QueryTypes.INSERT,
        }
      );

      return res.status(200).json({
        message: "success",
        status: 1,
      });
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  deviceActivation: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { deivce_serial_no } = req.body;

    try {
      const getSpecificData = await sequelize.query(
        `SELECT * FROM public.devices WHERE serial_no = $deivce_serial_no;`,
        {
          bind: { deivce_serial_no },
          type: QueryTypes.SELECT,
        }
      );

      if (getSpecificData.length === 0) {
        return res.status(404).json({
          message: "Item not found in database.",
          status: 0,
        });
      }

      const { id, store_id, activation } = getSpecificData[0];

      if (activation === 1) {
        await sequelize.query(
          `UPDATE public.devices SET activation = 0 WHERE id = $id;`,
          {
            bind: {
              id,
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.UPDATE,
          }
        );

        return res.status(200).json({
          message: "success - device is now deactivated.",
          status: 1,
        });
      } else {
        const getStoreData = await sequelize.query(
          `SELECT * FROM public.stores WHERE id = $store_id;`,
          {
            bind: { store_id },
            type: QueryTypes.SELECT,
          }
        );

        if (getStoreData.length === 0) {
          return res.status(404).json({
            message: "Store not found in database.",
            status: 0,
          });
        }

        const getAllProducts = await sequelize.query(
          `SELECT name FROM public.products ORDER BY created_datetime DESC;`,
          {
            type: QueryTypes.SELECT,
          }
        );

        if (getAllProducts.length === 0) {
          return res.status(404).json({
            message: "Products not found in database.",
            status: 0,
          });
        }

        const getAllCategories = await sequelize.query(
          `SELECT * FROM public.categories ORDER BY created_datetime DESC;`,
          {
            type: QueryTypes.SELECT,
          }
        );

        if (getAllCategories.length === 0) {
          return res.status(404).json({
            message: "Categories not found in database.",
            status: 0,
          });
        }

        const getAllTypeOfExpenses = await sequelize.query(
          `SELECT * FROM public.type_of_expenses ORDER BY created_datetime DESC;`,
          {
            type: QueryTypes.SELECT,
          }
        );

        if (getAllTypeOfExpenses.length === 0) {
          return res.status(404).json({
            message: "Types of Expenses not found in database.",
            status: 0,
          });
        }

        await sequelize.query(
          `UPDATE public.devices SET activation = 1 WHERE id = $id;`,
          {
            bind: {
              id,
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.UPDATE,
          }
        );

        return res.status(200).json({
          message: "success - device is now activated.",
          status: 1,
          data: {
            device: getSpecificData[0],
            store: getStoreData[0],
            products: getAllProducts[0],
            categories: getAllCategories[0],
            type_of_expenses: getAllTypeOfExpenses[0],
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  updateData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;
    const { serial_no, store_id } = req.body;

    try {
      await sequelize.query(
        `UPDATE public.devices SET serial_no = $serial_no, store_id = $store_id, updated_datetime = $updated_datetime
         WHERE id = $id RETURNING *;`,
        {
          bind: {
            id,
            serial_no,
            store_id,
            updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          type: QueryTypes.UPDATE,
        }
      );

      return res.status(200).json({
        message: "success",
        status: 1,
      });
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  deleteData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;

    try {
      await sequelize.query(
        `DELETE FROM public.devices WHERE id = $id RETURNING *;`,
        {
          bind: { id },
          type: QueryTypes.DELETE,
        }
      );

      return res.status(200).json({
        message: "success",
        status: 1,
      });
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
};
