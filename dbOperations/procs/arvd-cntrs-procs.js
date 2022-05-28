const config = require('../dbconfig.js');
const sql = require('mssql');

//inserts container header
async function arvdCntrsInr(_cntrNo,_cntrImg,_creaUser,_memo){
  try{
    var sqlcmd = "EXEC ARVD_CNTRS_INR @CNTR_NO ,@CNTR_IMG ,@CREA_USER,@MEMO";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("CNTR_NO",sql.Char,_cntrNo)
    .input("CNTR_IMG",sql.VarBinary(sql.MAX),_cntrImg)
    .input("CREA_USER",sql.Char,_creaUser)
    .input("MEMO",sql.Char,_memo)
    .query(sqlcmd);
    if(result.rowsAffected[0] > 0){
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

//inserts container details
async function arvdCntrs2Inr(_cntrNo,_prodId,_actual){
  try{
    var sqlcmd = "EXEC ARVD_CNTRS2_INR @CNTR_NO,@PROD_ID,@ACTUAL";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("CNTR_NO",sql.Char,_cntrNo)
    .input("PROD_ID",sql.Char,_prodId)
    .input("ACTUAL",sql.Money,_actual)
    .query(sqlcmd);
    console.log("arvdCntrs2Inr --- "+result.rowsAffected);
    return result.rowsAffected;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

//update container details
async function arvdCntrs2Upd(_cntrNo,_prodId,_existingActual,_actual){
  try{
    var sqlcmd = "EXEC ARVD_CNTRS2_UPD @ACTUAL,@NACTUAL,@CNTR_NO,@PROD_ID";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("ACTUAL",sql.Money,_existingActual)
    .input("NACTUAL",sql.Money,_actual)
    .input("CNTR_NO",sql.Char,_cntrNo)
    .input("PROD_ID",sql.Char,_prodId)
    .query(sqlcmd);
    return result.rowsAffected;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

module.exports = {
  arvdCntrsInr : arvdCntrsInr,
  arvdCntrs2Inr: arvdCntrs2Inr,
  arvdCntrs2Upd: arvdCntrs2Upd
}
