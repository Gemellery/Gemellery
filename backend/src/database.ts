import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "triv@@20050218",
  database: "gemellery",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
