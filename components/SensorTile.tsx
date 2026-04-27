import * as SQLite from "expo-sqlite";
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const db = SQLite.openDatabaseSync("greenhouse.db");

export default function SensorTile() {
   const [readings, setReading] = useState<any | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startPolling = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const result = db.getFirstSync(
         "SELECT temp, humidity, co2 FROM readings WHERE id = 1"
      );

      console.log("DB result:", result);

      if (result) {
        setReading(result);
      }
    }, 1000);
  };

  return ( 

     <View style={styles.card}>
     <Text style={styles.title}> 📊  Live Data</Text>
    {readings ? (
      <View>
        <Text>🌡 TEMP: {readings.temp.toFixed(1)}°C</Text>
        <Text>💧 HUMIDITY: {readings.humidity.toFixed(1)}°%</Text>
        <Text>🫁 CO2: {readings.co2.toFixed(1)}ppm</Text>
      </View>
    ) : (
      <Text style={styles.red}>No data available</Text>
    )}
  </View>
  
    
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
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
  red: {
    color: "#fb2439",
    fontWeight: "600",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});