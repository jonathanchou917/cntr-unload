const express = require('express');
const session = require('client-sessions');
const sql = require('mssql');
const bodyParser = require('body-parser');
const router = express.Router();
const logs = require('../dbOperations/procs/visitlogs.js');
const cntrs = require('../dbOperations/queries/arvd-cntrs-queries.js')

router.get('/home',(req,res) => {
  try{
    logs.visitLogsInr(req.ip,req.user_cookie.username,"GET","/home")
    .then(result => {
      if(result){
        if(req.user_cookie.username){
          var now = new Date();
          var day = ("0" + now.getDate()).slice(-2);
          var month = ("0" + (now.getMonth() + 1)).slice(-2);
          var today = now.getFullYear()+"-"+(month)+"-"+(day);
          cntrs.searchCntrs(today,today)
          .then(result2 => {
            console.log(today);
            res.render('homepage',{cntrs:result2, from:today, to:today});
          });

        }
        else{
          res.redirect('/');
        }
      }
    });
  }
  catch(error){
    console.log(error);
    return error;
  }
});

router.get('/home/:from/:to', (req,res) => {
  try{
    var from = req.params.from;
    var to = req.params.to;
    logs.visitLogsInr(req.ip,req.user_cookie.username,"GET","/home/"+from+"/"+to)
    .then(result => {
      if(result){
        if(req.user_cookie.username){
          cntrs.searchCntrs(from,to)
          .then(result2 => {
            res.render('homepage',{cntrs:result2,from:from,to:to});
          });

        }
        else{
          res.redirect('/');
        }
      }
    });
  }
  catch(error){
    console.log(error);
    return error;
  }
});

router.post('/home',(req,res) => {
  try{
    logs.visitLogsInr(req.ip,req.user_cookie.username,"POST","/home")
    .then(result => {
      if(result){
        if(req.user_cookie.username){
          var from = req.body.from;
          var to = req.body.to;
          res.redirect('/home/'+from+'/'+to);
        }
        else{
          res.redirect('/');
        }
      }
    });
  }
  catch(error){
    console.log(error);
    return error;
  }
});













module.exports=router;
