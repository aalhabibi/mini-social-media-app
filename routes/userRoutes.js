const express = require("express");

const isAuthenticated = require("../middlewares/authenticationMiddleWare");

const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const isAuthorized = require("../middlewares/authorizationMiddleWare");

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
  res.redirect("user/profile");
});
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("../views/user/profile.ejs", {
    user: req.session.userProfile,
  });
});

router.get("/:username/profile", isAuthenticated, async (req, res) => {
  res.render("../views/user/profile.ejs", {
    user: await profileController.getProfile(req.params.username),
    userProfile: req.session.userProfile,
  });
});

router.get("/:username/posts", isAuthenticated, async (req, res) => {
  const posts = await postController.getUserPosts(req.params.username);
  res.render("../views/user/userPosts.ejs", {
    user: await profileController.getProfile(req.params.username),
    userProfile: req.session.userProfile,
    posts: posts,
  });
});

router.get("/:username/comments", isAuthenticated, async (req, res) => {
  const comments = await commentController.getUserComments(req.params.username);
  res.render("../views/user/userComments.ejs", {
    user: await profileController.getProfile(req.params.username),
    currentUser: req.session.userProfile,
    userProfile: req.session.userProfile,
    comments: comments,
  });
});

router.get(
  "/:username/update-profile",
  isAuthenticated,
  isAuthorized,
  (req, res) => {
    res.render("profiles/updateProfile.ejs", {
      info: req.session.userProfile,
      userProfile: req.session.userProfile,
      message: "",
    });
  }
);

router.post(
  "/:username/update-profile",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    await profileController.updateProfile(req, res);
  }
);

router.delete(
  "/:username/delete-account",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    try {
      await profileController.deleteProfile(req.params.username);
      res.status(200).json({
        message: `Resource ${req.params.username} deleted successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
