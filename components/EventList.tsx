import * as SQLite from "expo-sqlite";
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Sparkline } from "./Sparkline";

const db = SQLite.openDatabaseSync("greenhouse.db");

const WINDOW_SIZE = 900;

const EventList = () => {
  
const [events, setEvents] = useState<any[]>([]);
 const [co2Series, setCo2Series] = useState<number[]>([]);

  let intervalRef: any = null;
  let buffer: number[] = [];
  let ewma = 0;
  const uiThrottleRef = useRef(0);

 useEffect(() => {
  
    startMockStream();
     // if(getGlobalConnection())
     // {startMockStream();}
   
   }, []);
  // -------------------------
  // 📊 Utility functions
  // -------------------------
  const mean = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  const std = (arr: number[]) => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
  };

  const median = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };

  // -------------------------
  // 🚨 Detection Logic
  // -------------------------
  const detectAnomaly = (value: number) => {
    const anomalies: any[] = [];

    if (buffer.length < 5) return anomalies;

    const m = mean(buffer);
    const s = std(buffer);

    // Z-score
    if (s !== 0) {
      const z = (value - m) / s;
      if (Math.abs(z) > 2.5) {
        anomalies.push({
          type: "Z_SCORE",
          reason: `Spike detected (z=${z.toFixed(2)})`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }

    // EWMA
    ewma = 0.3 * value + 0.7 * ewma;
    if (s !== 0) {
      const z = (value - ewma) / s;
      if (Math.abs(z) > 2.5) {
        anomalies.push({
          type: "EWMA",
          reason: `Drift from trend (ewma z=${z.toFixed(2)})`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }

    // Hampel
    const med = median(buffer);
    const absDev = buffer.map((v) => Math.abs(v - med));
    const mad = median(absDev);

    if (mad !== 0) {
      const score = Math.abs(value - med) / (1.4826 * mad);
      if (score > 3) {
        anomalies.push({
          type: "HAMPEL",
          reason: `Outlier detected (score=${score.toFixed(2)})`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }

    return anomalies;
  };
  const startMockStream = () => {
    if (intervalRef) return;

    intervalRef = setInterval(() => {
      const result = db.getFirstSync(
    "SELECT temp, humidity, co2 FROM readings WHERE id = 1") as { temp: number; humidity: number; co2: number };

      // 👉 pick one metric for demo (CO2 best for anomalies)
      //const value = result.co2;
       

      const raw = result?.co2;

  if (typeof raw !== "number" || isNaN(raw)) return;
   const value = raw;

      // maintain sliding window
      if (!isNaN(value)) {
  buffer.unshift(value);
}
      if (buffer.length > WINDOW_SIZE) buffer.pop();

      const anomalies = detectAnomaly(value);

      if (anomalies.length > 0) {
        setEvents((prev) => [...anomalies, ...prev]);
       console.log("Anomalies detected:", anomalies);
      }

      // -------------------------
      // throttled Sparkline UI update (5 sec)
      // -------------------------
      const now = Date.now();
      if (now - uiThrottleRef.current > 5000) {
        uiThrottleRef.current = now;
        setCo2Series([...buffer]);
      }

    }, 1000);
  };

  return (
    <View style={styles.container}>
       <Text style={styles.header}>📈 SparkLine Graph(CO₂ Trend)</Text>

      {/* Sparkline */}
     <Sparkline data={co2Series} width={320} height={90} />

     <View style={styles.line} />

      <Text style={styles.header}>⚠️ Event List</Text>
      <FlatList
        data={events}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={styles.reason}>Brief Reason: {item.reason}</Text>
            <Text style={styles.meta}>TimeStamp: {item.timestamp}</Text>
          </View>
        )}
         showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    marginTop: 10,
    marginHorizontal:10,
  },
  line: {
  height: 1,
  backgroundColor: "#000000",
  marginVertical: 10,
   marginTop: 10,
},
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reason: {
    color: "#fb2424",
    fontWeight: "200",
    fontSize: 12,
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});

export default EventList;