const config = require('../dbconfig.js');
const sql = require('mssql');


//gets containers in a date range
async function searchCntrs(_fmDt,_toDt){
  try{

    var sqlcmd ="SELECT * FROM V_ARVD_NARVD_CNTRS WHERE ETA >= @FMDATE AND ETA <= @TODATE ORDER BY CONTAINERNUMBER";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("FMDATE",sql.Date,_fmDt)
    .input("TODATE",sql.Date,_toDt)
    .query(sqlcmd);
    return result.recordset;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

//gets the container header
async function getCntrArvd(_cntrNum){
  try{
    var sqlcmd = " SELECT [CONTAINER NUMBER] AS CONTAINERNUMBER,IMAGE,MEMO,CREA_USER,CREA_DATE,UID FROM V_ARVD_CNTRS WHERE [CONTAINER NUMBER] = @CNTR_NO ";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("CNTR_NO",sql.Char,_cntrNum)
    .query(sqlcmd);
    return result;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

//gets the container details
async function getCntrDtl(_cntrNum){
  try{
    var sqlcmd = " SELECT A.[CONTAINER NUMBER] AS CONTAINERNUMBER,A.[PRODUCT ID] AS ACCESS_DB_PRODUCTID,ISNULL(B.[PRODUCT ID],'') AS CNTR_UNLOAD_PRODUCTID, A.QUANTITY,ISNULL(B.ACTUAL,0) AS ACTUAL " +
                 " FROM V_CONT_DATA2 AS A  LEFT JOIN V_ARVD_CNTRS2 AS B " +
                 " ON A.[CONTAINER NUMBER] COLLATE DATABASE_DEFAULT = B.[CONTAINER NUMBER] AND A.[PRODUCT ID] COLLATE DATABASE_DEFAULT = B.[PRODUCT ID] " +
                 " WHERE A.[CONTAINER NUMBER]  = @CNTR_NO ORDER BY A.CREA_DATE ";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("CNTR_NO",sql.Char,_cntrNum)
    .query(sqlcmd);
    return result;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

//searches if row exists in ARVD_CNTRS2
async function getArvdCntrDtls(_cntrNo,_prodId){
  try{
    var sqlcmd = "SELECT [CONTAINER NUMBER] AS CONTAINERNUMBER,[PRODUCT ID] AS PRODUCTID,ACTUAL FROM V_ARVD_CNTRS2 WHERE [CONTAINER NUMBER] = @CNTR_NO AND [PRODUCT ID] = @PROD_ID";
    let pool = await sql.connect(config);
    let result = await pool.request()
    .input("CNTR_NO",sql.Char,_cntrNo)
    .input("PROD_ID",sql.Char,_prodId)
    .query(sqlcmd)
    return result;
  }
  catch(error){
    console.log(error);
    return error;
  }
}

module.exports={
  searchCntrs: searchCntrs,
  getCntrArvd: getCntrArvd,
  getCntrDtl: getCntrDtl,
  getArvdCntrDtls : getArvdCntrDtls
}
