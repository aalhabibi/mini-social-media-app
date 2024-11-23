const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const { Profile } = require("./Profile");
const { Post } = require("./Post");
const { Comment } = require("./Comment");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      // references: {
      //   model: "Profile",
      //   key: "userId",
      // },
    },
    username: {
      type: DataTypes.STRING,
      // primaryKey: true,
      // references: {
      //   model: "Profile",
      //   key: "username",
      // },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "User",
    timestamps: false,
  }
);

User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE", // Automatically delete posts when a user is deleted
});
User.hasMany(Comment, {
  foreignKey: "userId",
  onDelete: "CASCADE", // Automatically delete posts when a user is deleted
});

Profile.belongsTo(User, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
};
