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

  let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
    }
  });

  connection.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.error('Database connection was closed, reconnecting...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
  
  module.exports = db;