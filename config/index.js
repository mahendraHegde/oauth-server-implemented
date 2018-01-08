
exports.token = {
  expiresIn               : 60 * 60,
  calculateExpirationDate : () => new Date(Date.now() + (this.token.expiresIn * 1000)),
  tkn:'thisistoken'
};


exports.codeToken = {
  expiresIn : 5 * 60,
};


exports.refreshToken = {
  expiresIn : 52560000,
};


exports.db = {
  timeToCheckExpiredTokens : 3600,
};

exports.session = {
  maxAge : 3600000 * 24 * 7 * 52,
  secret :'secret'
};

exports.client={
  id:'xyz',
  name:'XYZ',
  secret:'xyz'
};
exports.user={
  id:'abc',
  name:'bob',
  password:'secret'
};
exports.authCode={
  code:'thisisauthcode'
}
exports.DB={
 DBURL: 'mongodb://localhost:27017/oauth'
}
