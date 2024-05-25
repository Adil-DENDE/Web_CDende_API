const mysql = require("mysql");
const dotenv = require("dotenv");
const pool = mysql.createPool({
    host: dotenv.config().parsed.DB_HOST,
    user: dotenv.config().parsed.DB_USERNAME,
    database: dotenv.config().parsed.DB_DATABASE,
    password: dotenv.config().parsed.DB_PASSWORD,
    port: dotenv.config().parsed.DB_PORT,
  });

  pool.getConnection((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Db connection ok!");
    }
  });

  
  
  module.exports = pool;