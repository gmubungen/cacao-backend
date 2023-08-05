"use strict";

const { sequelize } = require("./sequelize");

const { QueryTypes } = require("sequelize");

const moment = require("moment");

const bcrypt = require("bcrypt");

const autoCreateData = async () => {
  try {
    // Here is the Role Pages will be created

    const roleMenu = [];

    const findPageHome = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/home';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageHome.length === 0) {
      const homeModules = [];

      const pageHome = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
         VALUES (gen_random_uuid(), 'Home', '/home', '${moment().format(
           "YYYY-MM-DD HH:mm:ss"
         )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageHome[0][0];

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: homeModules,
      });
    }

    const findPagePages = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/pages';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPagePages.length === 0) {
      const pagesModules = [];

      const pagePages = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
           VALUES (gen_random_uuid(), 'Pages', '/pages', '${moment().format(
             "YYYY-MM-DD HH:mm:ss"
           )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pagePages[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                   VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        pagesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                   VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        pagesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                   VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        pagesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: pagesModules,
      });
    }

    const findPageDevices = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/devices';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageDevices.length === 0) {
      const devicesModules = [];

      const pageDevices = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
             VALUES (gen_random_uuid(), 'Devices', '/devices', '${moment().format(
               "YYYY-MM-DD HH:mm:ss"
             )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageDevices[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                     VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        devicesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                     VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        devicesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                     VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        devicesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: devicesModules,
      });
    }

    const findPageEmployees = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/employees';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageEmployees.length === 0) {
      const employeesModules = [];

      const pageEmployees = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
               VALUES (gen_random_uuid(), 'Employees', '/employees', '${moment().format(
                 "YYYY-MM-DD HH:mm:ss"
               )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageEmployees[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                       VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        employeesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                       VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        employeesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                       VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        employeesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: employeesModules,
      });
    }

    const findPageIngredients = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/ingredients';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageIngredients.length === 0) {
      const ingredientsModules = [];

      const pageIngredients = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                 VALUES (gen_random_uuid(), 'Ingredients', '/ingredients', '${moment().format(
                   "YYYY-MM-DD HH:mm:ss"
                 )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageIngredients[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                         VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                         VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                         VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: ingredientsModules,
      });
    }

    const findPageIngredientsInventory = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/ingredients-inventory';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageIngredientsInventory.length === 0) {
      const ingredientsInventoryModules = [];

      const pageIngredientsInventory = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                   VALUES (gen_random_uuid(), 'Ingredients Inventory', '/ingredients-inventory', '${moment().format(
                     "YYYY-MM-DD HH:mm:ss"
                   )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageIngredientsInventory[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                           VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsInventoryModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                           VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsInventoryModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                           VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        ingredientsInventoryModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: ingredientsInventoryModules,
      });
    }

    const findPageProducts = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/products';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageProducts.length === 0) {
      const productsModules = [];

      const pageProducts = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                     VALUES (gen_random_uuid(), 'Products', '/products', '${moment().format(
                       "YYYY-MM-DD HH:mm:ss"
                     )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageProducts[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                             VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        productsModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                             VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        productsModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                             VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        productsModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: productsModules,
      });
    }

    const findPageRoles = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/roles';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageRoles.length === 0) {
      const rolesModules = [];

      const pageRoles = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                       VALUES (gen_random_uuid(), 'Roles', '/roles', '${moment().format(
                         "YYYY-MM-DD HH:mm:ss"
                       )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageRoles[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                               VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        rolesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                               VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        rolesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                               VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        rolesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: rolesModules,
      });
    }

    const findPageStoreRoles = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/store-roles';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageStoreRoles.length === 0) {
      const storeRolesModules = [];

      const pageStoreRoles = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                         VALUES (gen_random_uuid(), 'Store Roles', '/store-roles', '${moment().format(
                           "YYYY-MM-DD HH:mm:ss"
                         )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageStoreRoles[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                 VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeRolesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                 VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeRolesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                 VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeRolesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: storeRolesModules,
      });
    }

    const findPageStore = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/store-roles';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageStore.length === 0) {
      const storeModules = [];

      const pageStore = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                           VALUES (gen_random_uuid(), 'Stores', '/stores', '${moment().format(
                             "YYYY-MM-DD HH:mm:ss"
                           )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageStore[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                   VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                   VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                   VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storeModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: storeModules,
      });
    }

    const findPageTypeOfMeasurements = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/type-of-measurements';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageTypeOfMeasurements.length === 0) {
      const typeOfMeasurementsModules = [];

      const pageTypeOfMeasurements = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                             VALUES (gen_random_uuid(), 'Type of Measurements', '/type-of-measurements', '${moment().format(
                               "YYYY-MM-DD HH:mm:ss"
                             )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageTypeOfMeasurements[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                     VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        typeOfMeasurementsModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                     VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        typeOfMeasurementsModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      console.log(findModuleDelete);

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                     VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        typeOfMeasurementsModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: typeOfMeasurementsModules,
      });
    }

    const findPageStores = await sequelize.query(
      `SELECT * FROM public.pages WHERE link = '/stores';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findPageStores.length === 0) {
      const storesModules = [];

      const pageStores = await sequelize.query(
        `INSERT INTO public.pages (id, name, link, created_datetime, updated_datetime)
                               VALUES (gen_random_uuid(), 'Stores', '/stores', '${moment().format(
                                 "YYYY-MM-DD HH:mm:ss"
                               )}', '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );

      const { id, name, link, created_datetime, updated_datetime } =
        pageStores[0][0];

      const findModuleAdd = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'add' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleAdd.length === 0) {
        const pageAdd = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                       VALUES (gen_random_uuid(), 'add', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storesModules.push(pageAdd[0][0]);
      }

      const findModuleEdit = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'edit' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleEdit.length === 0) {
        const pageEdit = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                       VALUES (gen_random_uuid(), 'edit', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storesModules.push(pageEdit[0][0]);
      }

      const findModuleDelete = await sequelize.query(
        `SELECT * FROM public.actions WHERE name = 'delete' AND page_id = '${id}';`,
        {
          type: QueryTypes.SELECT,
        }
      );

      if (findModuleDelete.length === 0) {
        const pageDelete = await sequelize.query(
          `INSERT INTO public.actions (id, name, page_id, created_datetime, updated_datetime)
                                       VALUES (gen_random_uuid(), 'delete', '${id}', '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
          {
            type: QueryTypes.INSERT,
          }
        );

        storesModules.push(pageDelete[0][0]);
      }

      roleMenu.push({
        id,
        name,
        link,
        created_datetime,
        updated_datetime,
        modules: storesModules,
      });
    }

    const findSuperAdminUser = await sequelize.query(
      `SELECT * FROM public.employees WHERE username = 'cacao.admin';`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (findSuperAdminUser.length === 0) {
      let createdSuperAdminRole = null;

      const findRoleSuperAdmin = await sequelize.query(
        `SELECT * FROM public.roles WHERE name = 'super admin';`,
        { type: QueryTypes.SELECT }
      );

      if (findRoleSuperAdmin.length === 0) {
        const stringedArr = JSON.stringify(roleMenu);

        const returnedCreatedSuperAdminRole = await sequelize.query(
          `INSERT INTO public.roles (id, name, modules, super, created_datetime, updated_datetime) VALUES (gen_random_uuid(), 'super admin', '${stringedArr}', true, '${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`
        );

        createdSuperAdminRole = returnedCreatedSuperAdminRole[0][0];
      }

      const hashedPassword = await bcrypt.hash("strongP@ssword", 12);

      await sequelize.query(
        `INSERT INTO public.employees (id, first_name, middle_name, last_name, email, employee_no, contact_no, username, password, role_id, store_role_id, created_datetime, updated_datetime)
                                     VALUES (gen_random_uuid(), 'Admin', 'Admin', 'Admin', 'cacao.admin@gmail.com', '1', '1', 'cacao.admin', '${hashedPassword}', '${
          createdSuperAdminRole.id
        }', null, '${moment().format(
          "YYYY-MM-DD HH:mm:ss"
        )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}') RETURNING *;`,
        {
          type: QueryTypes.INSERT,
        }
      );
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is a problem in API.",
        status: 0,
      }),
    };
  }
};

autoCreateData();
