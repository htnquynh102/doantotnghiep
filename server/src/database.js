const mysql = require("mysql2/promise");

const mySqlPool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "nhuquynh123",
  database: "dbQuanLySuKien",
  port: 3306,
});

module.exports = mySqlPool;
