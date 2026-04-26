import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function WebSocketScreen() {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState("DISCONNECTED");
  const [messages, setMessages] = useState<string[]>([]);

  const connectWebSocket = () => {
    if (ws.current) {
      console.log("Already connected");
      return;
    }

    const socket = new WebSocket("ws://10.0.0.84:3000");

    socket.onopen = () => {
      console.log("Connected");
      setStatus("CONNECTED");
      socket.send(JSON.stringify({ type: "HELLO" }));
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      setStatus("ERROR");
    };

    socket.onclose = () => {
      console.log("Disconnected");
      setStatus("DISCONNECTED");
      ws.current = null;
    };

    ws.current = socket;
  };

  const disconnectWebSocket = () => {
    ws.current?.close();
    ws.current = null;
  };

  return (
    <View style={styles.container}>
      <Text>Connection Status: {status}</Text>

      <Button title="Connect" onPress={connectWebSocket} />
      <Button title="Disconnect" onPress={disconnectWebSocket} />

      {messages.map((msg, index) => (
        <Text style={styles.msgText} key={index}>{msg}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: "#24fb27",
    marginTop: 10,
    marginHorizontal:10,
  },
  msgText: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
});