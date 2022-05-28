const express = require('express');
const session = require('client-sessions');
const sql = require('mssql');
const bodyParser = require('body-parser');
const router = express.Router();
const logs = require('../dbOperations/procs/visitlogs.js');
const cntrs = require('../dbOperations/queries/arvd-cntrs-queries.js')
const cntrProcs = require('../dbOperations/procs/arvd-cntrs-procs.js');
const multer  = require('multer');
var storage = multer.memoryStorage();
var upload= multer({storage:storage});

router.get('/container/:cntrNo',(req,res) => {
  if(req.user_cookie.username){
    logs.visitLogsInr(req.ip,req.user_cookie.username,"GET","/container/"+req.params.cntrNo)
    .then(result => {
      if(result){
        var cntrNo = req.params.cntrNo;
        cntrs.getCntrArvd(cntrNo)
        .then(result2 => {
          cntrs.getCntrDtl(cntrNo)
          .then(result3 => {
            console.log(result3);
            res.render('container',{cntrData:result2,cntrDtls:result3,cntrNo:cntrNo});
          });
        });
      }
    });
  }
  else{
    res.redirect('/');
  }

});

router.post('/container/:cntrNo',upload.single('cntrImg'), async (req,res) => {
  if(req.user_cookie.username){
    logs.visitLogsInr(req.ip,req.user_cookie.username,"POST","/container/"+req.params.cntrNo)
    .then(result => {
      if(result){
        var cntrNo = req.params.cntrNo;
        var creaUser = req.user_cookie.username;
        var memo = "";
        if(req.xhr || req.accepts('json, html')==='json'){
          var cntrImg = req.file.buffer;
          cntrProcs.arvdCntrsInr(cntrNo,cntrImg,creaUser,memo)
          .then(result2 => {
            if(result2){
              res.send({response:"success"});
            }
          });
        }
      }
    });
  }
  else{
    res.redirect('/');
  }
});

router.post("/container/:cntrNo/details", async (req,res) => {
  if(req.user_cookie.username){
    var visited = await logs.visitLogsInr(req.ip,req.user_cookie.username,"POST","/container/"+req.params.cntrNo+"/details");
    if(visited){
      if(req.xhr || req.accepts('json, html')==='json'){
        var cntrNo = req.params.cntrNo;
        for(var i = 0; i < req.body.prodList.length; i++){
          var prodId = req.body.prodList[i].prodId;
          var actual = req.body.prodList[i].actual;
          var exists = await cntrs.getArvdCntrDtls(cntrNo,prodId);
          if(exists.recordsets[0].length > 0){
            var existingActual = exists.recordset[0].ACTUAL;
            await cntrProcs.arvdCntrs2Upd(cntrNo,prodId,existingActual,actual);
          }
          else if(exists.recordsets[0].length < 1){
            console.log(prodId);
            console.log(actual);
            await cntrProcs.arvdCntrs2Inr(cntrNo,prodId,actual);
          }
        }
        res.send({response:"success"});
      }
    }
    // logs.visitLogsInr(req.ip,req.user_cookie.username,"POST","/container/"+req.params.cntrNo+"/details")
    // .then(result => {
    //   if(result){
    //     if(req.xhr || req.accepts('json, html')==='json'){
    //       var cntrNo = req.params.cntrNo;
    //       for(var i = 0; i < req.body.prodList.length; i++){
    //         console.log(req.body.prodList[i]);
    //       }
    //     }
    //   }
    // });

  }
  else{
    res.redirect('/');
  }
});

module.exports=router;
