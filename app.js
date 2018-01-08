const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const config         = require('./config');
const express        = require('express');
const expressSession = require('express-session');
const passport       = require('passport');
 mongoose             =require('mongoose');

mongoose.Promise=global.Promise;

const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());

// Session Configuration
app.use(expressSession({
  saveUninitialized : true,
  resave            : true,
  secret            : config.session.secret,
  key               : 'authorization.sid',
  cookie            : { maxAge: config.session.maxAge },
}));

 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());
 app.use(passport.initialize());
app.use(passport.session());

require('./services/auth');
require('./routes/oauthRoute')(app);



mongoose.connect(config.DB.DBURL); // connect to database

mongoose.connection.on('error', function(err) {
    console.log(new Date() + ' Mongoose default connection error: ' + err);
});

mongoose.connection.on('connected', function() {
    console.log(' Mongoose default connection open to "' + config.DB.DBURL + '"');
    const oauthDB=require('./models/oauthSchema');

});


//openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// var options = {
//   key: fs.readFileSync('./certs/key.pem', 'utf8'),
//   cert: fs.readFileSync('./certs/server.crt', 'utf8')
// };

// https.createServer(options, app).listen(
//   3000,()=>{
//   console.log('OAuth 2.0 Authorization Server started on port 3000');
// });


app.listen(3000,()=>{
  console.log('is up @3000');
})
