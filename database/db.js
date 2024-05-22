const mysql = require("mysql");
const dotenv = require("dotenv");
const pool = mysql.createPool({
    host: dotenv.config().parsed.DB_HOST,
    user: dotenv.config().parsed.DB_USERNAME,
    database: dotenv.config().parsed.DB_DATABASE,
    password: dotenv.config().parsed.DB_PASSWORD,
  });

  pool.getConnection((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Db connection ok!");
    }
  });

  
  
  module.exports = pool;