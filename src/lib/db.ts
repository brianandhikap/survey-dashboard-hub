import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'survey',
  password: 'salatiga2024',
  database: 'survey_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});