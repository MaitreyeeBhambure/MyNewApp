import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function SensorTile({ type }: { type: string }) {
 // const value = useStore((s: any) => s.sensors[type]);

  return (
    <View style={styles.card}>
      <Text>{type.toUpperCase()}</Text>   //Temp / Humidity / CO2
      <Text>VALUE:20</Text>
    </View>
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
    backgroundColor: "#2ecc71",
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