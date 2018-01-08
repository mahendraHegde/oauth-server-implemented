const site           = require('../services/site');
const oauth2         = require('../services/oauth2');
module.exports=(app)=>{
    app.get('/',        site.index);
    app.get('/login',   site.loginForm);
    app.post('/login',  site.login);

    app.get('/dialog/authorize',           oauth2.authorization);
    app.post('/dialog/authorize/decision', oauth2.decision);
    app.post('/oauth/token',               oauth2.token);

    app.get('/api/userinfo',   site.info);
} 