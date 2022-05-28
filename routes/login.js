const express = require('express');
const session = require('client-sessions');
const sql = require('mssql');
const bodyParser = require('body-parser');
const router = express.Router();
const logs = require('../dbOperations/procs/visitlogs.js');
const loginAuth = require('../dbOperations/queries/login-auth.js');
const register = require('../dbOperations/procs/register.js');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({extended:false}));

router.post('/login',(req,res)=>{
  try{
    if(!req.user_cookie.username){
      if(req.xhr || req.accepts('json, html') === 'json'){
        var user = req.body.user.toUpperCase();
        var pass = req.body.pass;
        logs.visitLogsInr(req.ip,user,"POST","/login")
        .then(result => {
          if(result){
            loginAuth.userCheck(user)
            .then(result2 => {
              if(result2.recordsets[0].length < 1){
                res.send( {response: "no match"} )
              }
              else if(result2.recordsets[0].length > 0){
                bcrypt.compare(pass, result2.recordset[0].PASS,(err, outcome) =>{
                  if(outcome){
                    req.user_cookie.username = user;
                    res.send( {response:"match"} );
                  }
                  else{
                    res.send( {response: "no match"} )
                  }
                });
              }
            });
          }
        });
      }
    }
    else if(req.user_cookie.username){

    }
  }
  catch(error){
    console.log(error);
    return error;
  }
});


router.get('/register',(req,res)=>{
  try{
    if(!req.user_cookie.username){
      logs.visitLogsInr(req.ip,"","GET","/register")
      .then(result => {
        if(result){
          res.render('register');
        }
      });
    }
    else if(req.user_cookie.username){

    }
  }
  catch(error){
    console.log(error);
    return error;
  }
});

router.post('/register', async (req,res)=>{
  try{
    if(!req.user_cookie.username){
      if(req.xhr || req.accepts('json, html')==='json'){
        var newUser = req.body.newUser.toUpperCase();
        var newPass = req.body.newPass;
        var hashedPassword = await bcrypt.hash(newPass,14);
        logs.visitLogsInr(req.ip,"","POST","/register")
        .then(result => {
          if(result){
            loginAuth.newUserCheck(newUser)
            .then(result2 => {
              if(result2 > 0){
                res.send({response:"exists"});
              }
              else if(result2 < 1){
                register.createNewUser(newUser,hashedPassword)
                .then(result3 => {
                  if(result3){
                    res.send({response:"success"});
                  }
                });
              }
            });
          }
        });
      }
    }
    else if(req.user_cookie.username){

    }
  }
  catch(error){
    console.log(error);
    return error;
  }
});



module.exports=router;
