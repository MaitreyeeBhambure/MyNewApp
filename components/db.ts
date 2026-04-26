import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("greenhouse.db");

export function initDB() {
    db.execSync(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
        temp REAL,
        humidity REAL,
        co2 REAL,
        timestamp INTEGER
  );
`);
 
};

export const insertReading = (data: { temp: number; humidity: number; co2: number }) => {
    console.log("insertReading called with:", data);


    db.runSync(
  "INSERT INTO readings (temp, humidity, co2) VALUES (?, ?, ?)",
      [data.temp, data.humidity, data.co2]
);
}

export default db;




