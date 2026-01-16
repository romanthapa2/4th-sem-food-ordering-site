import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
    port: 3306,
  user: "roman",
  password: process.env.DB_PASSWORD,
  database: "web_clg_db",
  ssl: {
    rejectUnauthorized: false
  }
});
