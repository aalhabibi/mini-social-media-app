const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("../models/User");
const profileModel = require("../models/Profile");

const secret = "supersecretkey";

//Checks if email exists in database
async function checkEmail(enteredEmail) {
  const email = await userModel.User.findAll({
    where: {
      email: enteredEmail,
    },
    attributes: ["email"],
  });

  if (email[0]) return true;
  else return false;
}

//Checks if username exists in database
async function checkUsername(enteredUsername) {
  const username = await userModel.User.findAll({
    where: {
      username: enteredUsername,
    },
    attributes: ["username"],
  });

  if (username[0]) return true;
  else return false;
}

//Checks if password is valid (at least 8 characters)
function checkPassword(password) {
  if (password.length < 8) return false;
  else return true;
}

//Gets password by username
async function getPassword(username) {
  const query = await userModel.User.findAll({
    where: {
      username: username,
    },
    attributes: ["password"],
  });
  return query[0].dataValues.password;
}

async function getUserId(email) {
  const query = await userModel.User.findAll({
    where: {
      email: email,
    },
    attributes: ["userId"],
  });
  return query[0].dataValues.userId;
}

async function loginUser(req, res) {
  loggingUser = {
    username: req.body.username,
    password: req.body.password,
  };

  const isRegisteredUsername = await checkUsername(loggingUser.username);

  if (!isRegisteredUsername) {
    res.render("../views/auth/login.ejs", {
      message: "This username is not registered.",
      username: "",
    });
  } else {
    if (
      bcrypt.compare(
        loggingUser.password,
        await getPassword(loggingUser.username),
        async (err, result) => {
          if (err) console.log(err);
          if (result) {
            const query = await profileModel.Profile.findAll({
              where: {
                username: loggingUser.username,
              },
            });

            req.session.Authenticated = true;
            req.session.userProfile = query[0].dataValues;

            res.redirect("/profiles");
          } else
            res.render("../views/auth/login.ejs", {
              message: "Wrong password.",
              username: loggingUser.username,
            });
        }
      )
    ) {
    }
  }
}

async function registerUser(req, res) {
  user = {
    username: req.body.username,
    name: req.body.name,
    address: req.body.address,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
  };

  const isValidEmail = !(await checkEmail(user.email));
  const isValidUsername = !(await checkUsername(user.username));

  if (!isValidEmail) {
    res.render("../views/auth/register.ejs", {
      message: "This email is already registered.",
      info: user,
    });
  } else if (!isValidUsername) {
    res.render("../views/auth/register.ejs", {
      message: "This username is already registered.",
      info: user,
    });
  } else if (!checkPassword(user.password)) {
    res.render("../views/auth/register.ejs", {
      message: "Password has to be at least 8 characters.",
      info: user,
    });
  } else {
    let newuserId;
    await bcrypt.hash(user.password, 10, async (err, hash) => {
      if (err) console.log(err);
      const newUser = await userModel.User.create({
        username: user.username,
        age: user.age,
        email: user.email,
        password: hash,
      });
      await profileModel.Profile.create({
        userId: newUser.dataValues.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        address: user.address,
        age: user.age,
      });
      // console.log(newUser);
      const query = await profileModel.Profile.findAll({
        where: {
          userId: newUser.dataValues.userId,
        },
      });
      // console.log(query);
      req.session.Authenticated = true;
      req.session.userProfile = query[0].dataValues;

      res.redirect("/profiles");
    });
  }
}

async function sendResetLink(req, res) {
  const emailExists = await checkEmail(req.body.email);
  if (!emailExists) {
    res.render("../views/auth/sendResetLink.ejs", {
      message: "This email is not registered.",
      email: req.body.email,
    });
  } else {
    const userId = await getUserId(req.body.email);
    // console.log(userId);
    const payload = { userId: userId };
    const token = jwt.sign(payload, secret, { expiresIn: "5m" });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "minisocialapp1@gmail.com",
        pass: "mksn jrfw hapn icjc",
      },
    });

    const mailOptions = {
      from: "minisocialapp1@gmail.com",
      to: req.body.email,
      subject: "Password Reset",
      text: `Here is the password reset link: http://localhost:3000/auth/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });
    //7agat
    res.render("../views/auth/sendResetLink.ejs", {
      message: `We've sent a password reset link to ${req.body.email}.\nPlease note that the link expires after 5 minutes.`,
      email: req.body.email,
    });
  }
}

async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, secret);
    // console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token has expired");
      return false;
    } else {
      console.error("Error verifying token:", error.message);
      return false;
    }
  }
}

async function resetPassword(req, res) {
  if (req.body.newPassword != req.body.confirmPassword) {
    res.render("../views/auth/resetPass.ejs", {
      message: "Passwords do not match.",
      token: req.params.token,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });
  } else if (!checkPassword(req.body.newPassword)) {
    res.render("../views/auth/resetPass.ejs", {
      message: "Password must be at least 8 characters",
      token: req.params.token,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });
  } else {
    const userId = await jwt.verify(req.params.token, secret).userId;
    // console.log(userId);
    await bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
      if (err) console.log(err);
      await userModel.User.update(
        {
          password: hash,
        },
        {
          where: {
            userId: userId,
          },
        }
      );
    });
    res.redirect("/auth/login/password-reset");
  }
}

module.exports = {
  checkEmail,
  checkPassword,
  getPassword,
  checkUsername,
  sendResetLink,
  getUserId,
  verifyToken,
  resetPassword,
  loginUser,
  registerUser,
};
