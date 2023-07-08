require("dotenv").config();

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT,
  dialectOptions: {
    dateStrings: true,
    typeCast(field, next) {
      // for reading from database
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 1800000,
    idle: 10000,
  },
};
