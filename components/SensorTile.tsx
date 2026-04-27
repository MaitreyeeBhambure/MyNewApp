import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

const db = SQLite.openDatabaseSync("greenhouse.db");

export default function SensorTile({ type }: { type: string }) {
   const [readings, setReadings] = useState<any[]>([]);
   let intervalRef: any = null;

  useEffect(() => {
    clearDB(); 
    fetchData();
   startMockStream();
    // if(getGlobalConnection())
    // {startMockStream();}
  
  }, []);

   const fetchData = () => {
    const result = db.getAllSync(
      "SELECT temp, humidity, co2 FROM readings ORDER BY id DESC LIMIT 3"
    );

    setReadings(result);
  };

  const updateReading = (data: any) => {
  db.runSync(
    `INSERT INTO readings (id, temp, humidity, co2)
     VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       temp = excluded.temp,
       humidity = excluded.humidity,
       co2 = excluded.co2`,
    [data.temp, data.humidity, data.co2]
  );
};

const startMockStream = () => {
    if (intervalRef) return; // ✅ prevent multiple intervals

  intervalRef = setInterval(() => {
    const fakeData = {
      temp: (20 + Math.random() * 5).toFixed(2),
      humidity: (40 + Math.random() * 20).toFixed(2),
      co2: (350 + Math.random() * 300).toFixed(2),
    };
    updateReading(fakeData); // update DB
    fetchData();  
  }, 1000);
  return () => clearInterval(intervalRef);
  };


const clearDB = () => {
  db.execSync("DELETE FROM readings");
};

  return ( 
  <ScrollView>
     <FlatList
      style={styles.card}
      data={readings}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>🌡 TEMP: {item.temp}</Text>
          <Text>💧 HUMIDITY: {item.humidity}</Text>
          <Text>🫁 CO2: {item.co2}</Text>
        </View>
        
      )}
    />
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000000",
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 10,
  },
  reason: {
    color: "#fbbf24",
    fontWeight: "600",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});