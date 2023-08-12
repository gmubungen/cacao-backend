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
    const { limit, offset } = req.query;

    if (!req.isAuth) {
      return res.status(403).json({
        message: "unauthenticated request",
        status: 0,
      });
    }

    try {
      const getAllData = await sequelize.query(
        `SELECT employees.id as id, employees.first_name as first_name,
         employees.middle_name as middle_name, employees.last_name as last_name,
         employees.email as email, employees.employee_no as employee_no,
         employees.contact_no as contact_no, employees.username as username,
         employees.created_datetime as created_datetime, employees.updated_datetime as updated_datetime,
         employees.role_id as role_id, employees.store_role_id as store_role_id,
         roles.name as role_name
         FROM public.employees INNER JOIN roles ON employees.role_id = roles.id ORDER BY created_datetime DESC${
          limit && offset ? ` LIMIT ${limit} OFFSET ${offset}` : ""
        };`,
        {
          type: QueryTypes.SELECT,
        }
      );

      const getCount = await sequelize.query(
        `SELECT COUNT(id) FROM public.employees;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Computation of Number of Pages
      const pageCount = Math.ceil(parseInt(getCount[0].count) / limit);

      return res.status(200).json({
        data: await Promise.all(
          getAllData.map((item) => {
            return {
              id: item.id,
              name: `${item.first_name} ${item.middle_name} ${item.last_name}`,
              employee_no: item.employee_no,
              email: item.email,
              contact_no: item.contact_no,
              role_name: item.role_name,
              store_role_name: item.store_role_name,
              role_id: item.role_id,
              store_role_id: item.store_role_id,
              username: item.username,
              created_datetime: item.created_datetime,
              updated_datetime: item.updated_datetime,
            };
          })
        ),
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
