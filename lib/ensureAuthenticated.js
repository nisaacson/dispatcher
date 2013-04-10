module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    var is_confirmed = req.user.confirmed
    if (is_confirmed) {
      return next();
    }
    req.logOut();
    req.session.error = 'A site adminstrator must confirm your account before you can log in'
    res.redirect('/login');
    return;
  }
  res.redirect('/login');
}
