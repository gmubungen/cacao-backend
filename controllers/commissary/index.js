"use strict";

const { sequelize } = require("../../sequelize");

const { QueryTypes } = require("sequelize");

const moment = require("moment");
const { Query } = require("pg");

module.exports = {
  getAllData: async (req, res) => {
    // const { limit, offset } = req.query;

    // if (!req.isAuth) {
    //   return res.status(403).json({
    //     message: "unauthenticated request",
    //     status: 0,
    //   });
    // }

    try {
      const getCommissaryItems = await sequelize.query(
        `SELECT commissary.id as "commissary_id", commissary."count", commissary.amount, commissary.updated_datetime as "as_of", ingredients.id as "ingredient_id", ingredients."name" as "ingredient_name"
         FROM commissary RIGHT JOIN ingredients on commissary.ingredient_id = ingredients.id WHERE store_id IS NULL AND commissary."count" IS NOT NULL AND commissary.amount IS NOT NULL ORDER BY commissary.updated_datetime DESC;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      const getStores = await sequelize.query(
        `SELECT id, name FROM stores ORDER BY created_datetime DESC;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      const getStoreItems = await Promise.all(
        getStores.map(async (item) => {
          const getDelivery = await sequelize.query(
            `SELECT commissary.id as "commissary_id", commissary."count", commissary.amount, commissary.updated_datetime as "as_of", ingredients.id as "ingredient_id", ingredients."name" as "ingredient_name"
             FROM commissary RIGHT JOIN ingredients on commissary.ingredient_id = ingredients.id WHERE store_id = $store_id;`,
            {
              bind: {
                store_id: item.id,
              },
              type: QueryTypes.SELECT,
            }
          );

          return {
            store_id: item.id,
            store_name: item.name,
            delivery: getDelivery,
          };
        })
      );

      return res.status(200).json({
        data: {
          commissary: getCommissaryItems,
          stores: getStoreItems,
        },
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
    // if (!req.isAuth) {
    //   return res.status(403).json({
    //     message: "unauthenticated request",
    //     status: 0,
    //   });
    // }

    const { items } = req.body;

    try {
      let i = 0;

      do {
        const { ingredient_id, count } = items[i];

        const returnedData = await sequelize.query(
          `INSERT INTO public.commissary (id, ingredient_id, count, created_datetime, updated_datetime)
           VALUES (gen_random_uuid(), $ingredient_id, $count, $created_datetime, $updated_datetime) RETURNING *;`,
          {
            bind: {
              ingredient_id,
              count,
              created_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.INSERT,
          }
        );

        const { id } = returnedData[0][0];

        const getPrice = await sequelize.query(
          `SELECT price FROM ingredients WHERE id = $ingredient_id;`,
          {
            bind: {
              ingredient_id,
            },
            type: QueryTypes.SELECT,
          }
        );

        await sequelize.query(
          `UPDATE commissary SET amount = $amount, updated_datetime = $updated_datetime WHERE id = $id;`,
          {
            bind: {
              id,
              amount: getPrice[0].price * count,
              updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            type: QueryTypes.UPDATE,
          }
        );

        i++;
      } while (i < items.length);

      return res.status(200).json({
        message: "success",
        status: 1,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
  updateData: async (req, res) => {
    // if (!req.isAuth) {
    //   return res.status(403).json({
    //     message: "unauthenticated request",
    //     status: 0,
    //   });
    // }

    const { id } = req.params;
    const { ingredient_id, count } = req.body;

    try {
      const getPrice = await sequelize.query(
        `SELECT price FROM ingredients WHERE id = $ingredient_id;`,
        {
          bind: {
            ingredient_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      await sequelize.query(
        `UPDATE public.commissary SET count = $count, amount = $amount, updated_datetime = $updated_datetime
         WHERE id = $id RETURNING *;`,
        {
          bind: {
            id,
            count,
            amount: getPrice[0].price * count,
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
    // if (!req.isAuth) {
    //   return res.status(403).json({
    //     message: "unauthenticated request",
    //     status: 0,
    //   });
    // }

    const { id } = req.params;

    try {
      await sequelize.query(
        `DELETE FROM public.commissary WHERE id = $id RETURNING *;`,
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
  storeDelivery: async (req, res) => {
    const { delivery } = req.body;

    try {
      let i = 0;

      do {
        const { ingredient_id, count, store_id } = delivery[i];

        const getCommissaryCount = await sequelize.query(
          `SELECT count FROM commissary WHERE ingredient_id = $ingredient_id AND store_id IS NULL;`,
          {
            bind: {
              ingredient_id,
            },
            type: QueryTypes.UPDATE,
          }
        );

        if (getCommissaryCount[0][0].count <= count) {
          return res.status(409).json({
            message:
              "Items delivered in store is more than the remaining stock in Commissary.",
            status: 0,
          });
        } else {
          const getPrice = await sequelize.query(
            `SELECT price FROM ingredients WHERE id = $ingredient_id;`,
            {
              bind: {
                ingredient_id,
              },
              type: QueryTypes.SELECT,
            }
          );

          await sequelize.query(
            `INSERT INTO commissary (id, ingredient_id, store_id, count, amount, created_datetime, updated_datetime)
             VALUES (gen_random_uuid(), $ingredient_id, $store_id, $count, $amount, now(), now());`,
            {
              bind: {
                ingredient_id,
                store_id,
                count,
                amount: getPrice[0].price * count,
              },
              type: QueryTypes.INSERT,
            }
          );

          await sequelize.query(
            `UPDATE commissary SET count = count - $count, amount = (count - $count) * $price, updated_datetime = $updated_datetime
             WHERE ingredient_id = $ingredient_id AND store_id IS NULL RETURNING *;`,
            {
              bind: {
                count,
                price: getPrice[0].price,
                ingredient_id,
                updated_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              type: QueryTypes.UPDATE,
            }
          );
        }

        i++;
      } while (i < delivery.length);

      return res.status(200).json({
        message: "success",
        status: 1,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "There is a problem in API.",
        status: 0,
      });
    }
  },
};
