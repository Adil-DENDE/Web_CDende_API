const mysql = require("mysql");
const dotenv = require("dotenv");
const db = mysql.createConnection({
    host: dotenv.config().parsed.DB_HOST,
    user: dotenv.config().parsed.DB_USERNAME,
    database: dotenv.config().parsed.DB_DATABASE,
    password: dotenv.config().parsed.DB_PASSWORD,
  });

  db.connect((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Db connection!");
    }
  });

  
  
  module.exports = db;