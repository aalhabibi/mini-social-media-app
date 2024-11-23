const express = require("express");

const isAuthenticated = require("../middlewares/authenticationMiddleWare");

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const isAuthorized = require("../middlewares/authorizationMiddleWare");

const router = express.Router();

router.get(
  "/:commentid/edit",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    res.render("../views/comment/editComment.ejs", {
      comment: await commentController.getCommentById(req.params.commentid),
      userProfile: req.session.userProfile,
    });
  }
);

router.post(
  "/:commentid/edit",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    await commentController.editComment(req, res);
  }
);

router.delete(
  "/:commentid/delete",
  isAuthenticated,
  isAuthorized,
  async (req, res) => {
    await commentController.deleteComment(req, res);
  }
);

module.exports = router;
