const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define(
    "Page",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      link: {
        type: DataTypes.STRING,
      },
      created_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        get() {
          const dateText = this.getDataValue("created_datetime");
          return moment(dateText).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      updated_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        get() {
          const dateText = this.getDataValue("updated_datetime");
          return moment(dateText).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    },
    {
      paranoid: true,
      tableName: "pages",
    }
  );

  Page.beforeCreate((item) => {
    toLowerData(item);
  });

  Page.beforeUpdate((item) => {
    toLowerData(item);
  });

  Page.associate = (models) => {};

  return Page;
};

const toLowerData = (item) => {
  console.log(item);
  //   const { name, link, user } = item;

  //   item.name = name ? name.toLowerCase().trim() : name;
  //   item.link = link ? link.toLowerCase().trim() : link;
  //   item.user = user ? user.toLowerCase().trim() : user;

  //   return item;
};
