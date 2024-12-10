const sqlite3 = require('sqlite3').verbose();
const dbName = 'genkiTwoOne.db';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      ala INTEGER DEFAULT 0,
      salt INTEGER DEFAULT 0,
      wai INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      return console.error('Error creating table:', err.message);
    }
  });
});

module.exports = db;
