const mysql = require("mysql");
const dotenv = require("dotenv");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cdende",
});

  db.connect((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Db connection!");
    }
  });

  
  
  module.exports = db;