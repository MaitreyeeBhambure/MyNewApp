import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

const db = SQLite.openDatabaseSync("greenhouse.db");

const WINDOW_SIZE = 20;

const EventList = () => {
  
const [events, setEvents] = useState<any[]>([]);

  let intervalRef: any = null;
  let buffer: number[] = [];
  let ewma = 0;

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
      const fakeData = {
        temp: Number((20 + Math.random() * 5).toFixed(2)),
        humidity: Number((40 + Math.random() * 20).toFixed(2)),
        co2: Number((350 + Math.random() * 300).toFixed(2)),
      };

      // 👉 pick one metric for demo (CO2 best for anomalies)
      const value = fakeData.co2;

      // maintain sliding window
      buffer.unshift(value);
      if (buffer.length > WINDOW_SIZE) buffer.pop();

      const anomalies = detectAnomaly(value);

      if (anomalies.length > 0) {
        setEvents((prev) => [...anomalies, ...prev]);
        console.log("Anomalies detected:", anomalies);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚠️ Anomalies</Text>

      <FlatList
       
        data={events}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={styles.reason}>{item.type}</Text>
            <Text>{item.reason}</Text>
            <Text style={styles.meta}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    marginTop: 10,
    marginHorizontal:10,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reason: {
    color: "#fb2424",
    fontWeight: "600",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});

export default EventList;