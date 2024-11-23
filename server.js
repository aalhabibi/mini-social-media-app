const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const userModel = require("./models/User");
const profileModel = require("./models/Profile");
const postModel = require("./models/Post");
const commentModel = require("./models/Comment");

const profileController = require("./controllers/profileController");
const commentController = require("./controllers/commentController");

async function syncModels() {
  await userModel.User.sync({ force: true });
  await profileModel.Profile.sync({ force: true });
  await postModel.Post.sync({ force: true });
  await commentModel.Comment.sync({ force: true });
}
// syncModels();

const app = express();

app.use(
  session({
    secret: "supersecret",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
    // cookie: { maxAge: 100 * 60 * 60 },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const isAuthenticated = require("./middlewares/authenticationMiddleWare");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

app.get("/", isAuthenticated, (req, res) => {
  res.redirect("/profiles");
});

app.get("/profiles", isAuthenticated, async (req, res) => {
  let usernames = await profileController.getAllProfiles();
  res.render("profiles/allProfiles.ejs", {
    usernames: usernames,
    userProfile: req.session.userProfile,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.redirect("/"); // Redirect to home page after session is destroyed
  });
});

app.listen(3000, function () {
  console.log("Express App running at http://localhost:3000/");
});
