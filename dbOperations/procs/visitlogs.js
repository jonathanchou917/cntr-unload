const config = require('../dbconfig.js');
const sql = require('mssql');

//logs every request
async function visitLogsInr(_ipAdd,_userName,_mthd,_route){
  try{
    var sqlcmd = "EXEC VISTSLOGS_INR @IP_ADDRESS,@USERNAME,@METHOD,@ROUTE"
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("IP_ADDRESS",sql.Char,_ipAdd)
    .input("USERNAME",sql.Char,_userName)
    .input("METHOD",sql.Char,_mthd)
    .input("ROUTE",sql.Char,_route)
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

module.exports = {
  visitLogsInr: visitLogsInr
}
