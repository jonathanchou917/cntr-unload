require('dotenv').config();
const express = require('express');
const session = require('client-sessions');
const sql = require('mssql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const logs = require('./dbOperations/procs/visitlogs.js');

//for the css and imgs in the public folder
app.use(express.static('public'));
//for using body parser to parse html variables
app.use(bodyParser.urlencoded({
  extended: false
}));

//useing bodyParser
app.use(bodyParser.json());

//for using ejs
app.set('view engine', 'ejs');

//initiate a session
app.use(session({
  cookieName: 'user_cookie',
  secret: process.env.COOKIE_SECRET,
  duration: 1000 * 60 * 30,
  activeDuration: 1000 * 60 * 30
}));

//for using login route
app.use(require('./routes/login'));
//for using home route
app.use(require('./routes/home'));
//for using container route
app.use(require('./routes/container'));

app.get('/',(req,res)=>{
  if(!req.user_cookie.username){
    logs.visitLogsInr(req.ip,"","GET","/")
    .then(result => {
      if(result){
        res.render('login');
      }
    });
  }
  else if(req.user_cookie.username){
    res.redirect('/home');
  }
});

app.listen(3001,(req,res)=>{
  console.log("open on 3001");
})
