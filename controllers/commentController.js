const commentModel = require("../models/Comment");

async function getPostComments(postID) {
  const comments = await commentModel.Comment.findAll({
    where: {
      postID: postID,
    },
  });

  return comments;
}
async function getUserComments(username) {
  const comments = await commentModel.Comment.findAll({
    where: {
      username: username,
    },
  });

  return comments;
}
async function getCommentById(id) {
  const comment = await commentModel.Comment.findAll({
    where: {
      commentID: id,
    },
  });

  return comment[0];
}

async function postComment(userId, postID, username, content) {
  await commentModel.Comment.create({
    userId: userId,
    postID: postID,
    username: username,
    content: content,
  });
}

async function editComment(req, res) {
  const comment = await commentModel.Comment.update(
    { content: req.body.content },
    {
      where: {
        commentID: req.params.commentid,
      },
    }
  );
  const postID = await (
    await getCommentById(req.params.commentid)
  ).dataValues.postID;
  res.redirect(`/post/${postID}`);
}

async function deleteComment(req, res) {
  try {
    const postID = await (
      await getCommentById(req.params.commentid)
    ).dataValues.postID;
    await commentModel.Comment.destroy({
      where: {
        commentID: req.params.commentid,
      },
    });

    res.status(200).redirect(`/post/${postID}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getPostComments,
  postComment,
  getUserComments,
  getCommentById,
  editComment,
  deleteComment,
};
