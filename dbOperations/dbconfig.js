const config = {
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  server: process.env.DB_ADDRESS,
  database: process.env.DB_DB,
  options: {
    trustedConnection: true,
    enableArithAort: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
          }
  },
  port: Number(process.env.DB_PORT)
}

//this exports the dbconfig so that it can be required on other .js files
module.exports = config;
