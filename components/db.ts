import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("greenhouse.db");

export function initDB() {
    db.execSync(`
 CREATE TABLE IF NOT EXISTS readings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
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
export const updateReading = (data: { temp: number; humidity: number; co2: number }) => {
   console.log("updateReading called with:", data);
  db.runSync(
    `INSERT INTO readings (id, temp, humidity, co2, timestamp)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       temp = excluded.temp,
       humidity = excluded.humidity,
       co2 = excluded.co2,
       timestamp = excluded.timestamp`,
    [data.temp, data.humidity, data.co2, Date.now()]
  );

  console.log("updateReading called with:", data);
};
// export const updateReading = (data: { temp: number; humidity: number; co2: number }) => {
   


//     db.runSync(
//  `UPDATE readings 
//        SET temp = ?, humidity = ?, co2 = ?
//        WHERE id = ?`,
//       [data.temp, data.humidity, data.co2]
// );
// }

export default db;






