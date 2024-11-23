const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("MiniSocialMediaAppBee", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
