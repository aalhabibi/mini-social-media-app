const express = require("express");

const isAuthenticated = require("../middlewares/authenticationMiddleWare");

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const isAuthorized = require("../middlewares/authorizationMiddleWare");

const router = express.Router();

router.get("/new", isAuthenticated, (req, res) => {
  res.render("../views/post/newPost.ejs", {
    userProfile: req.session.userProfile,
  });
});

router.post("/new", isAuthenticated, async (req, res) => {
  const postID = await postController.newPost(
    req.session.userProfile.userId,
    req.body.title,
    req.body.content,
    req.session.userProfile.username
  );
  res.redirect(`/post/${postID}`);
});

router.get("/:id", isAuthenticated, async (req, res) => {
  const post = await postController.getPostByID(req.params.id);

  res.render("../views/post/viewPost.ejs", {
    userProfile: req.session.userProfile,
    post: post,
    comments: await commentController.getPostComments(req.params.id),
  });
});

router.get("/:id/edit", isAuthenticated, isAuthorized, async (req, res) => {
  const post = await postController.getPostByID(req.params.id);

  res.render("../views/post/editPost.ejs", {
    userProfile: req.session.userProfile,
    post: post,
  });
});

router.post("/:id/edit", isAuthenticated, isAuthorized, async (req, res) => {
  const post = await postController.getPostByID(req.params.id);
  await postController.editPost(
    req.params.id,
    req.body.title,
    req.body.content
  );
  res.redirect(`/post/${req.params.id}`);
});

router.delete(
  "/:id/delete",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    try {
      await postController.deletePost(req.params.id);
      res.status(200).json({
        message: `Resource ${req.params.username} deleted successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/:id/post-comment", isAuthenticated, async (req, res) => {
  await commentController.postComment(
    req.session.userProfile.userId,
    req.params.id,
    req.session.userProfile.username,
    req.body.text
  );
  res.redirect(`/post/${req.params.id}`);
});

module.exports = router;
