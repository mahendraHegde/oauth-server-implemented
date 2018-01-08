
const login    = require('connect-ensure-login');
const passport = require('passport');

exports.index = (req, res) => {
  if (!req.query.code) {
    res.send('index');
  } else {
    res.send('index-with-code');
  }
};

exports.loginForm = (req, res) => {
  res.render('login');
};

/**
 * Authenticate normal login page using strategy of authenticate
 */
exports.login = [
  passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }),
];

exports.info = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope });
  },
];


