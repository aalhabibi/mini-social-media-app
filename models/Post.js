const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const { Comment } = require("./Comment");
const { User } = require("./User");

const Post = sequelize.define(
  "Post",
  {
    postID: {
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
      allowNull: false,
      // references: {
      //   model: "User",
      //   key: "username",
      // },
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Post",
    timestamps: false,
  }
);

Post.hasMany(Comment, {
  foreignKey: "postID",
  onDelete: "CASCADE", // Automatically delete posts when a user is deleted
});

Comment.belongsTo(Post, { foreignKey: "postID" });

module.exports = {
  Post,
};
