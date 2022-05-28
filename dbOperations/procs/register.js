const config = require('../dbconfig.js');
const sql = require('mssql');

async function createNewUser(_userName,_pass){
  try{
    var sqlcmd = "EXEC LOGINS_INR @USERNAME,@PASS";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("USERNAME",sql.Char,_userName)
    .input("PASS",sql.Char,_pass)
    .query(sqlcmd);
    if(result.rowsAffected > 0){
      return true;
    }
    else{
      return false;
    }
  }
  catch(error){
    console.log(error);
    return error;
  }
}

module.exports ={
  createNewUser: createNewUser
}
