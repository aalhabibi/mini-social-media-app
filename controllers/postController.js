const postModel = require("../models/Post");
const { post } = require("../routes/authRoutes");

async function newPost(userId, title, content, username) {
  const post = await postModel.Post.create({
    userId: userId,
    title: title,
    content: content,
    username: username,
  });

  return post.dataValues.postID;
}

async function getUserPosts(username) {
  const posts = await postModel.Post.findAll({
    where: {
      username: username,
    },
    attributes: ["postID", "title", "content"],
  });

  return posts;
}

async function getUsernameByPostID(postID) {
  const post = await postModel.Post.findAll({
    where: {
      postID: postID,
    },
    attributes: ["username"],
  });

  return post[0].dataValues.username;
}

async function getPostByID(id) {
  const post = await postModel.Post.findAll({
    where: {
      postID: id,
    },
  });

  return post[0];
}

async function editPost(postID, newTitle, newContent) {
  const post = await postModel.Post.update(
    { title: newTitle, content: newContent },
    {
      where: {
        postID: postID,
      },
    }
  );
}

async function deletePost(postID) {
  await postModel.Post.destroy({
    where: {
      postID: postID,
    },
  });
}

module.exports = {
  newPost,
  getUserPosts,
  getPostByID,
  editPost,
  getUsernameByPostID,
  deletePost,
};
