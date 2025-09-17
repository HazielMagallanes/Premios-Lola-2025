// Database connection and setup logic, adapted from the old codebase.
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: "../../.env", override: true });

// Create connection using SQL_URL from environment variables
const db = mysql.createConnection(process.env.SQL_URL as string);
const AMOUNT_GROUPS = 5; // Total number of groups to initialize in state table

// On connect, create tables if not exist and initialize state/admin
// This is run once at server start
export function initializeDatabase() {
  db.connect((error) => {
    if (error) throw error;
    console.log('Connected to MySQL!');
    const setupQueries = [
      `CREATE TABLE IF NOT EXISTS \`votos\` (
        ID tinyint AUTO_INCREMENT PRIMARY KEY,
        school tinytext NOT NULL,
        name text NOT NULL,
        logo tinytext NOT NULL,
        votes smallint UNSIGNED NOT NULL DEFAULT 0,
        \`group\` smallint UNSIGNED NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS \`users\` (
        ID int AUTO_INCREMENT PRIMARY KEY,
        UID text NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE
      )`,
      `CREATE TABLE IF NOT EXISTS \`state\` (
        ID tinyint AUTO_INCREMENT PRIMARY KEY,
        \`group\` smallint UNSIGNED NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT FALSE
      )`
    ];
    setupQueries.forEach((query) => {
      db.query(query, (error) => {
        if (error) throw error;
        console.log('Table or data setup successfully');
      });
    });
    // Make myself admin if not exists
    db.query('SELECT * FROM users WHERE UID = ?', [process.env.ADMIN_UID || 1], (error, result) => {
      if (error) throw error;
      if ((result as any[]).length === 0) {
        db.query('INSERT INTO users (ID, UID, is_admin) VALUES (0, ?, TRUE)', [process.env.ADMIN_UID || 1], (error) => {
          if (error) throw error;
          console.log('Admin registered correctly');
        });
      }
    });
    // Inicia el estado en False para todos los grupos del 1 al 2 si no existen
    for (let group = 1; group <= AMOUNT_GROUPS; group++) {
      db.query('SELECT * FROM state WHERE ID = ? AND `group` = ?', [group, group], (error, result) => {
        if (error) throw error;
        if ((result as any[]).length === 0) {
          db.query('INSERT INTO state (ID, enabled, `group`) VALUES (?, FALSE, ?)', [group, group], (error) => {
            if (error) throw error;
            console.log('State initialized as False for group #' + group);
          });
        }
      });
    }
  });
}

export default db;
