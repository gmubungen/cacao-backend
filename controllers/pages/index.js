"use strict";

const { sequelize } = require("../../sequelize");

const { QueryTypes } = require("sequelize");

const moment = require("moment");

module.exports = {
  getAllData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    try {
      const getAllData = await sequelize.query(
        `SELECT * FROM public.pages ORDER BY created_datetime DESC;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json({
        data: getAllData,
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
        `SELECT * FROM public.pages WHERE id = '${id}';`,
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

      return res.status(200).json({
        data: getSpecificData,
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
  createData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { name, link } = req.body;

    try {
      await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
         VALUES (gen_random_uuid(), $name, $link, $created_datetime, $updated_datetime) RETURNING *;`,
        {
          bind: {
            name,
            link,
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
  updateData: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;
    const { name, link } = req.body;

    try {
      await sequelize.query(
        `UPDATE public.pages SET name = $name, link = $link, updated_datetime = $updated_datetime
         WHERE id = $id RETURNING *;`,
        {
          bind: {
            id,
            name,
            link,
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
        `DELETE FROM public.pages WHERE id = $id RETURNING *;`,
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
