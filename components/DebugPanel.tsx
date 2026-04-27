import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DebugProps = {
  lastEventAgeMs: number;
  eventsPerSec: number;
  reconnectCount: number;
  seq: number;
  version: string | number;
  duplicateCount: number;
  gapCount: number;
};

const DebugPanel = (props: DebugProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> 📡Debug Panel</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Last Event Age</Text>
        <Text style={styles.value}>{props.lastEventAgeMs} ms</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Events/sec (EMA)</Text>
        <Text style={styles.value}>{props.eventsPerSec.toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Reconnect Count</Text>
        <Text style={styles.value}>{props.reconnectCount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Sequence</Text>
        <Text style={styles.value}>{props.seq}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Version</Text>
        <Text style={styles.value}>{props.version}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Duplicate Count</Text>
        <Text style={styles.value}>{props.duplicateCount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Gap Count</Text>
        <Text style={styles.value}>{props.gapCount}</Text>
      </View>
    </View>
  );
};

// -------------------------
// 🎯 Example Usage Component
// -------------------------
export default function DebugPanelExample() {
  return (
    <View style={{ padding: 20 }}>
      <DebugPanel
        lastEventAgeMs={120}
        eventsPerSec={4.27}
        reconnectCount={2}
        seq={105}
        version={"1.0.3"}
        duplicateCount={3}
        gapCount={1}
      />
    </View>
  );
}

// -------------------------
// 🎨 Styles
// -------------------------
const styles = StyleSheet.create({
  container: {
    height: 300,
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    marginTop: 5,

  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#334155",
  },

  label: {
    color: "#94a3b8",
    fontSize: 13,
  },

  value: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 13,
  },
});