const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const { User } = require("./User");

const Profile = sequelize.define(
  "Profile",
  {
    profileId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      // autoIncrement: true,
      // primaryKey: true,
      references: {
        model: "User",
        key: "userId",
      },
    },
    username: {
      type: DataTypes.STRING,
      // primaryKey: true,
      // references: {
      //   model: "User",
      //   key: "username",
      // },
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    // password: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
  },
  {
    tableName: "Profile",
    timestamps: false,
  }
);

module.exports = {
  Profile,
};
