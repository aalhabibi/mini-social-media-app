const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");

const Comment = sequelize.define(
  "Comment",
  {
    commentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Post",
        key: "postID",
      },
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
      allowNull: false,
      // references: {
      //   model: "User",
      //   key: "username",
      // },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Comment",
    timestamps: false,
  }
);

module.exports = {
  Comment,
};
