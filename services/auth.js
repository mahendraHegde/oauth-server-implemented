'use strict';

const passport                             = require('passport');
const { Strategy: LocalStrategy }          = require('passport-local');
const { Strategy: BearerStrategy }         = require('passport-http-bearer');
const{Strategy:ClientPasswordStrategy}     =require('passport-oauth2-client-password');
const config                               =require('../config/index')
const db =require('../models/oauthSchema');


passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
    db.Client.findOne({ client_id: clientId }, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.client_secret != clientSecret) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new LocalStrategy((username, password, done) => {
  db.User.findOne({username:username},(err,user)=>{
    if(err){
      done(err);
    }else if(user){
     
      if(user.password==password){
         done(null,user);
      }
      else
      done(null,false);
    }else
    {
      done(null,false);
    }
  });
}));


passport.use(new BearerStrategy((accessToken, done) => {
  db.Token.find({token:accessToken,expires: {$gt: new Date()}}).populate('user').exec((err,usr)=>{
    if(err){
      done(err)
    }else if(usr.length>0){
    console.log(usr[0].user);
    done(null,usr[0].user,{scope:'*'});
    }else{
      done(null,false)
    }
  });
}));


passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {

  db.User.findOne({username:username},(err,user)=>{
    if(err){
      done(err);
    }else if(user){
         done(null,user);
    }else
    {
      done('User Not Found');
    }
  });
});
