const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.dbName,
  port: 3306,
});

module.exports = conn;
