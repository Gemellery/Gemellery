import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sam@0305",
  database: "gemellery",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
