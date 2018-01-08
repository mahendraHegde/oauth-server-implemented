const config      = require('../config');
const login       = require('connect-ensure-login');
const oauth2orize = require('oauth2orize');
const passport    = require('passport');
const db=require('../models/oauthSchema');
const uuidv1 = require('uuid/v1');


const server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code((client, redirectURI, user, ares,state, done) => {
  
  db.Client.find({
    domains:{  $elemMatch: { url: redirectURI } }

  },(err,val)=>{
    if(err){
      done(err)
    }else if(val.length>0){
      let code=uuidv1();

      let cl=new db.GrantCode({
        code:code,
        user:user,
        client:client
      });
      cl.save((err,createdCode)=>{
        if(err){
          done(err)
        }else if(createdCode){
          done(null,code);
        }else{
          done('something went wrong!!!');
        }
      });
    }else{
      done('invalid redirectURI');
    }

  });
  
}));


server.exchange(oauth2orize.exchange.code((client, code, redirectURI, done) => {
// console.log(client)
  db.GrantCode.find({client:client._id,code:code,active:true},(err,grantRecord)=>{
    if(err){
      done(err);
    }else if(grantRecord.length>0){
      db.GrantCode.findOneAndUpdate({code: code}, {$set:{active:false}}, {new: true}, function(err, doc){
        if(err){
            done(err);
        }else if(doc){
          db.Token.update({user:grantRecord[0].user,client:client},{$set:{expires:new Date()}},{multi: true},(err,doc)=>{
            //console.log(doc);
          });
          let tkn=uuidv1();
            let tk=new db.Token({
              token:tkn,
              user:grantRecord[0].user,
              client:client
            });
            tk.save((err,tokenRecord)=>{
              if(err){
                done(err);
              }else if(tokenRecord){
                return done(null,tkn,null,null);
              }else{
                done('Token generation error');
              }
            })
          
        }else{
          done('Inavlid Grant code')
        }
    });
     
    }else{
      done(null,false);
    }
  });

}));



server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  // db.refreshTokens.find(refreshToken)
  // .then(foundRefreshToken => validate.refreshToken(foundRefreshToken, refreshToken, client))
  // .then(foundRefreshToken => validate.generateToken(foundRefreshToken))
  // .then(token => done(null, token, null, expiresIn))
  // .catch(() => done(null, false));
}));


exports.authorization = [
  login.ensureLoggedIn(),
  server.authorization((clientID, redirectURI, scope, done) => {

    db.Client.findOne({client_id:clientID},(err,client)=>{
      if(err)done(err)
      else if(client){
        done(null, client, redirectURI);
      }else
      {
        done('invalid client Id')
      }
      
    });
  }), (req, res, next) => {
     // console.log(req.oauth2.client);
      if(config.client.id==req.query.client_id){
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
      }else
      {
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
      }

  }];


exports.decision = [
  login.ensureLoggedIn(),
  server.decision(),
];

exports.token = [
  passport.authenticate([ 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
];

server.serializeClient((client, done) => 
{
  done(null, client.client_id);
});

server.deserializeClient((id, done) => {

  db.Client.findOne({client_id:id},(err,client)=>{
    if(err)done(err)
    else if(client){
      done(null, client);
    }else
    {
      done('invalid client Id')
    }
    
  });
});

