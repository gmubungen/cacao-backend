"use strict";

// Importing Bcrypt
const bcrypt = require("bcrypt");

//Importing JSON Web Token
const jwt = require("jsonwebtoken");

const { sequelize } = require("../../sequelize");

const { QueryTypes } = require("sequelize");

module.exports = {
  userLogin: async (req, res) => {
    const { loginUsername, loginPassword } = req.body;

    try {
      if (!loginUsername || !loginPassword) {
        return res.status(404).json({
          message: "Username and Password not found!",
          status: 0,
        });
      }

      const findUser = await sequelize.query(
        `SELECT id,
            first_name,
            middle_name,
            last_name,
            email,
            employee_no,
            contact_no,
            username,
            password,
            role_id,
            store_role_id
            FROM public.employees WHERE username = $username;`,
        {
          bind: {
            username: loginUsername,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findUser.length == 0) {
        return res.status(404).json({
          message: "Username and Password not found!",
          status: 0,
        });
      }

      const isPasswordValid = await bcrypt.compare(
        loginPassword,
        findUser[0].password
      );

      if (!isPasswordValid) {
        return res.status(404).json({
          message: "Username and Password not found!",
          status: 0,
        });
      }

      findUser[0].role_menu = null;
      findUser[0].store_role_menu = null;

      const findRole = await sequelize.query(
        `SELECT modules FROM public.roles WHERE id = $role_id;`,
        {
          bind: {
            role_id: findUser[0].role_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findRole.length !== 0) {
        findUser[0].role_menu = JSON.parse(findRole[0].modules);
      }

      const findStoreRole = await sequelize.query(
        `SELECT modules FROM public.store_roles WHERE id = $store_role_id;`,
        {
          bind: {
            store_role_id: findUser[0].store_role_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      if (findStoreRole.length !== 0) {
        findUser[0].store_role_menu = findStoreRole[0].modules;
      }

      const {
        id,
        first_name,
        middle_name,
        last_name,
        email,
        employee_no,
        contact_no,
        username,
        password,
        role_id,
        store_role_id,
        role_menu,
        store_role_menu,
      } = findUser[0];

      return res.status(200).json({
        message: "Login success!",
        data: {
          id,
          first_name,
          middle_name,
          last_name,
          email,
          employee_no,
          contact_no,
          username,
          password,
          role_id,
          store_role_id,
          role_menu,
          store_role_menu,
          token: jwt.sign(
            {
              id,
              first_name,
              middle_name,
              last_name,
              email,
              employee_no,
              username,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 60 * 60 * 24,
            }
          ),
        },
        status: 1,
      });
    } catch (error) {
      return res.status(503).json({
        message: "Login Failed!",
        status: 0,
      });
    }
  },
};
