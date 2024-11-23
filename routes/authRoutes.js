const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

//Login routes

router.get("/login", (req, res) => {
  if (req.session.Authenticated) res.redirect("/profiles");
  else res.render("../views/auth/login.ejs", { message: "", username: "" });
});

router.get("/login/password-reset", (req, res) => {
  if (req.session.Authenticated) res.redirect("/profiles");
  else
    res.render("../views/auth/login.ejs", {
      message: "Password has been reset successfully.",
      username: "",
    });
});

router.post("/login", async (req, res) => {
  authController.loginUser(req, res);
});

//Reset Password Routes

router.get("/request-reset", (req, res) => {
  res.render("../views/auth/sendResetLink.ejs", { email: "", message: "" });
});

router.post("/request-reset", (req, res) => {
  authController.sendResetLink(req, res);
});

router.get("/reset-password/:token", async (req, res) => {
  const token = await authController.verifyToken(req.params.token);
  if (!token) {
    res.send("Invalid Token");
  } else {
    res.render("../views/auth/resetPass.ejs", {
      message: "",
      token: req.params.token,
      newPassword: null,
      confirmPassword: null,
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  await authController.resetPassword(req, res);
});

//Register routes

router.get("/register", (req, res) => {
  if (req.session.user) res.redirect("/profile");
  else
    res.render("../views/auth/register.ejs", {
      message: "",
      info: {
        username: "",
        name: "",
        address: "",
        age: "",
        email: "",
        password: "",
      },
    });
});

router.post("/register", async (req, res) => {
  authController.registerUser(req, res);
});

module.exports = router;
