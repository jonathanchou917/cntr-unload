const config = require('../dbconfig.js');
const sql = require('mssql');

async function newUserCheck(_userName){
  try{
    var sqlcmd = "SELECT * FROM V_LOGINS WHERE USERNAME = @USERNAME"
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("USERNAME",sql.Char,_userName)
    .query(sqlcmd);
    return result.recordsets[0].length;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

async function userCheck(_userName){
  try{
    var sqlcmd = "SELECT USERNAME, PASS FROM V_LOGINS WHERE USERNAME = @USERNAME"
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("USERNAME",sql.Char,_userName)
    .query(sqlcmd);
    return result;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

module.exports = {
  newUserCheck: newUserCheck,
  userCheck: userCheck
}
