import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";


const EventList = () => {
  

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.reason}>{item.reason}</Text>
      <Text style={styles.meta}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚠️ Anomalies</Text>

      <FlatList
        data={[]} // Replace with actual events from store
        renderItem={renderItem}
       // keyExtractor={(item, index) => item.id ?? index.toString()}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: "#4ffb24",
    marginTop: 10,
    marginHorizontal:10,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000000",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reason: {
    color: "#4ffb24",
    fontWeight: "600",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});

export default EventList;