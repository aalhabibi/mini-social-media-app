const bcrypt = require("bcrypt");

const userModel = require("../models/User");
const profileModel = require("../models/Profile");

const authController = require("./authController");
const { where } = require("sequelize");

async function getAllProfiles() {
  const users = await profileModel.Profile.findAll({
    attributes: ["username"],
  });

  let usernames = [];
  users.forEach((user) => {
    usernames.push(user.dataValues.username);
  });
  return usernames;
}

async function getProfile(username) {
  const user = await profileModel.Profile.findAll({
    where: {
      username: username,
    },
  });
  if (!user[0]) return 0;
  else return user[0].dataValues;
}

async function updateProfileDatabase(newInfo, userProfile) {
  // console.log(newInfo);
  // console.log(userProfile);

  if (newInfo.username != userProfile.username) {
    if (await authController.checkUsername(newInfo.username)) {
      console.log("!username");
      return "!username";
    }
  }
  if (newInfo.email != userProfile.email) {
    if (await authController.checkEmail(newInfo.email)) {
      console.log("!email");
      return "!email";
    }
  }
  if (
    !(await authController.checkPassword(newInfo.password)) &&
    !(newInfo.password == "")
  ) {
    console.log("!password");
    return "!password";
  }

  try {
    if (newInfo.password == "") {
      await userModel.User.update(
        {
          username: newInfo.username,
          // name: newInfo.name,
          // age: newInfo.age,
          email: newInfo.email,
          // password: hash,
        },
        {
          where: {
            username: userProfile.username,
          },
        }
      );
      await profileModel.Profile.update(
        {
          username: newInfo.username,
          name: newInfo.name,
          address: newInfo.address,
          age: newInfo.age,
          email: newInfo.email,
        },
        {
          where: {
            username: userProfile.username,
          },
        }
      );
      return "updated";
    } else {
      await bcrypt.hash(newInfo.password, 10, async (err, hash) => {
        if (err) console.log(err);
        await userModel.User.update(
          {
            username: newInfo.username,
            // name: newInfo.name,
            // age: newInfo.age,
            email: newInfo.email,
            password: hash,
          },
          {
            where: {
              username: newInfo.username,
            },
          }
        );
      });
      await profileModel.Profile.update(
        {
          username: newInfo.username,
          name: newInfo.name,
          address: newInfo.address,
          age: newInfo.age,
          email: newInfo.email,
        },
        {
          where: {
            username: newInfo.username,
          },
        }
      );
      return "updated";
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateProfile(req, res) {
  const newInfo = {
    username: req.body.username,
    name: req.body.name,
    address: req.body.address,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newInfo);
  console.log(req.session.userProfile);

  const result = await updateProfileDatabase(newInfo, req.session.userProfile);

  // console.log(result);
  switch (result) {
    case "updated": {
      req.session.userProfile = {
        username: req.body.username,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        email: req.body.email,
      };

      res.render("profiles/updateProfile.ejs", {
        info: req.session.userProfile,
        userProfile: req.session.userProfile,
        message: "Profile updated successfully.",
      });
      break;
    }

    case "!username": {
      res.render("profiles/updateProfile.ejs", {
        info: newInfo,
        userProfile: req.session.userProfile,
        message: "Username already registered",
      });
      break;
    }

    case "!email": {
      res.render("profiles/updateProfile.ejs", {
        info: newInfo,
        userProfile: req.session.userProfile,
        message: "Email already registered",
      });
      break;
    }

    case "!password": {
      res.render("profiles/updateProfile.ejs", {
        info: newInfo,
        userProfile: req.session.userProfile,
        message: "Password must be at least 8 characters",
      });
      break;
    }

    default:
      break;
  }
}

async function deleteProfile(username) {
  await userModel.User.destroy({
    where: {
      username: username,
    },
  });
  await profileModel.Profile.destroy({
    where: {
      username: username,
    },
  });
}

module.exports = {
  getAllProfiles,
  getProfile,
  updateProfileDatabase,
  deleteProfile,
  updateProfile,
};
