import React from "react";
import { StyleSheet, Text, View } from "react-native";


const getStatusColor = (status: string) => {
  switch (status) {
    case "LIVE":
      return "#2ecc71";
    case "RECONNECTING":
      return "#f39c12";
    default:
      return "#e74c3c";
  }
};

const Header = () => {
 

  const lastUpdated = new Date().toLocaleTimeString();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>🌱 Greenhouse Monitor</Text>

      {/* Status Row */}
      <View style={styles.row}>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: getStatusColor("LIVE") },
          ]}
        >
          <Text style={styles.statusText}>LIVE</Text>
        </View>

        <Text style={styles.timestamp}>Last: {lastUpdated}</Text>
      </View>

      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    textAlign: "center",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "white",

  },
  statusText: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
  timestamp: {
     color: "white",
    fontSize: 12,
  },
  summary: {
    marginTop: 10,
  },
  summaryText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
});

export default Header;