const mysql = require("mysql");
require('dotenv').config()

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
});

module.exports = connection;