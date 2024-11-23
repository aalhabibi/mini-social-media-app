const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

async function isAuthorized(req, res, next) {
  if (req.params.username) {
    if (req.params.username == req.session.userProfile.username) {
      return next();
    } else res.send("Not authorized");
  } else if (req.params.id) {
    const username = await postController.getUsernameByPostID(req.params.id);
    if (username == req.session.userProfile.username) {
      return next();
    } else res.send("Not authorized");
  } else if (req.params.commentid) {
    const username = (
      await commentController.getCommentById(req.params.commentid)
    ).dataValues.username;
    if (username == req.session.userProfile.username) {
      return next();
    } else res.send("Not authorized");
  } else return next();
}

module.exports = isAuthorized;
