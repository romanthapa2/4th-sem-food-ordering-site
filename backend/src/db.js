import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 17311,
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "clg",
  ssl: {
    rejectUnauthorized: false
  }
});
