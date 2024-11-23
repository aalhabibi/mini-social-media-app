function isAuthenticated(req, res, next) {
  if (req.session.Authenticated) {
    return next();
  }
  res.redirect("/auth/login");
}

module.exports = isAuthenticated;
