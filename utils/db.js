const Database = require("better-sqlite3");
const db = new Database(__basedir + "/data/db.sqlite");

db.pragma("synchronous = 1");

db.pragma("journal_mode = wal");

//Create a table with all petitions for every day
db.prepare(
  ` CREATE TABLE IF NOT EXISTS petitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      date TEXT, 
      petitions INTEGER,
      types TEXT,
      invalids_petitions INTEGER DEFAULT 0
      )
      `
).run();

const petitions = {
    insertRow: db.prepare(`
        INSERT OR IGNORE INTO petitions (
            date,
            petitions
        ) VALUES (? , ?)
    `),

    selectAll: db.prepare(`
        SELECT * FROM petitions
    `),
    selectToday: db.prepare(`
        SELECT * FROM petitions WHERE date = ?
    `),
    selectLast: db.prepare(`
        SELECT * FROM petitions ORDER BY id DESC LIMIT 1
    `),
    addPetition: db.prepare(`
        UPDATE petitions SET petitions = petitions + 1 WHERE date = ?
    `),
    addType: db.prepare(`
        UPDATE petitions SET types = ? WHERE date = ?
    `),
    addInvalidPetition: db.prepare(`
        UPDATE petitions SET invalids_petitions = invalids_petitions + 1 AND petitions = petitions - 1 WHERE date = ?
    `),
}

module.exports = {
    petitions
}