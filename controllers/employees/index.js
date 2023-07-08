"use strict";

const { sequelize } = require("../../sequelize");

const { QueryTypes } = require("sequelize");

const moment = require("moment");

// Importing Bcrypt
const bcrypt = require("bcrypt");

// Random String
const randomString = async (length, chars) => {
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

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
        `SELECT * FROM public.employees ORDER BY created_datetime DESC;`,
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
        `SELECT * FROM public.employees WHERE id = $id;`,
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

    const {
      first_name,
      middle_name,
      last_name,
      email,
      employee_no,
      contact_no,
      username,
      role_id,
      store_role_id,
    } = req.body;

    try {
      const findUser = await sequelize.query(
        `SELECT id FROM public.employees WHERE username = $username;`,
        {
          bind: { username },
          type: QueryTypes.SELECT,
        }
      );

      if (findUser.length !== 0) {
        return res.status(403).json({
          message: "User Already In Used!",
          status: 0,
        });
      }

      const findEmail = await sequelize.query(
        `SELECT id FROM public.employees WHERE email = $email;`,
        {
          bind: { email },
          type: QueryTypes.SELECT,
        }
      );

      if (findEmail.length !== 0) {
        return res.status(403).json({
          message: "Email Already In Used!",
          status: 0,
        });
      }

      const temporary_password = await randomString(
        4,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );

      const hashedPassword = await bcrypt.hash(temporary_password, 12);

      await sequelize.query(
        `INSERT INTO public.employees (
            id,
            first_name,
            middle_name,
            last_name,
            email,
            employee_no,
            contact_no,
            username,
            password,
            created_datetime,
            updated_datetime,
            role_id,
            store_role_id)
         VALUES (
            gen_random_uuid(),
            $first_name,
            $middle_name,
            $last_name,
            $email,
            $employee_no,
            $contact_no,
            $username,
            $password,
            $created_datetime,
            $updated_datetime,
            $role_id,
            $store_role_id) RETURNING *;`,
        {
          bind: {
            first_name: first_name.trim(),
            middle_name: middle_name.trim(),
            last_name: last_name.trim(),
            email: email.trim(),
            employee_no: employee_no.trim(),
            contact_no: contact_no.trim(),
            username: username.trim(),
            password: hashedPassword,
            role_id,
            store_role_id,
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
    const {
      first_name,
      middle_name,
      last_name,
      email,
      employee_no,
      contact_no,
      username,
      role_id,
      store_role_id,
    } = req.body;

    try {
      const findUser = await sequelize.query(
        `SELECT * FROM public.employees WHERE id = $id;`,
        {
          bind: {
            id,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findUser.length === 0) {
        return res.status(404).json({
          message: "User not found!",
          status: 0,
        });
      }

      const findSameEmail = await sequelize.query(
        `SELECT email_address FROM public.employees WHERE id = $id AND email = $email;`,
        {
          bind: {
            id,
            email: email.trim(),
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findSameEmail.length === 0) {
        return res.status(403).json({
          message: "User not found!",
          status: 0,
        });
      }

      const findSameUsername = await sequelize.query(
        `SELECT id, username FROM public.employees WHERE id = $id AND username = $username;`,
        {
          bind: {
            id,
            username,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findSameUsername.length !== 0) {
        await sequelize.query(
          `UPDATE public.employees SET 
                 first_name = $first_name,
                 middle_name = $middle_name,
                 last_name = $last_name,
                 email = $email,
                 employee_no = $employee_no,
                 contact_no = $contact_no,
                 username = $username,
                 role_id = $role_id,
                 store_role_id = $store_role_id,
                 updated_datetime = $updated_datetime
                 WHERE id = $id RETURNING *;`,
          {
            bind: {
              id,
              first_name: first_name.trim(),
              middle_name: middle_name.trim(),
              last_name: last_name.trim(),
              email: email.trim(),
              employee_no: employee_no.trim(),
              contact_no: contact_no.trim(),
              username: username.trim(),
              role_id,
              store_role_id,
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.UPDATE,
          }
        );

        return res.status(200).json({
          message: "success",
          status: 1,
        });
      } else {
        return res.status(404).json({
          message: "Username doesn't exist!",
          status: 0,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  deleteData: async (event, context, callback) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;

    try {
      await sequelize.query(
        `DELETE FROM public.employees WHERE id = $id RETURNING *;`,
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
  changePassword: async (req, res) => {
    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    const { id } = req.params;
    const { current_password, new_password, confirm_password } = req.body;

    try {
      const findUser = await sequelize.query(
        `SELECT * FROM public.employees WHERE id = $id;`,
        {
          bind: { id },
          type: QueryTypes.SELECT,
        }
      );

      const isPasswordExist = await bcrypt.compare(
        current_password,
        findUser[0].password
      );

      if (!isPasswordExist) {
        return res.status(403).json({
          message:
            "The Current Password you entered doesn't match the Password in the records!",
          status: 0,
        });
      }

      if (new_password === confirm_password) {
        const hashedPassword = await bcrypt.hash(new_password.trim(), 12);

        await sequelize.query(
          `UPDATE public.employees SET password = $password, updated_datetime = $updated_datetime WHERE id = $id;`,
          {
            bind: {
              id,
              password: hashedPassword,
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.UPDATE,
          }
        );
      } else {
        return res.status(403).json({
          message: "New and Confirm New Password doesn't much!",
          status: 0,
        });
      }

      return res.status(200).json({
        message: "Change Password Success!",
        status: 1,
      });
    } catch (error) {
      return res.status(503).json({
        message: "Request cannot continue!",
        status: 0,
      });
    }
  },
};
