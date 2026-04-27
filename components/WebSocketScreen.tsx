import { setGlobalConnection } from "@/constants/global";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { insertReading, updateReading } from "./db";

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
      setGlobalConnection(true);
      socket.send(JSON.stringify({ type: "Request for data" }));
    };

    socket.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      setMessages((prev) => [...prev, event.data]);

       try {
    const msg =
      typeof event.data === "string"
        ? JSON.parse(event.data)
        : event.data;

    console.log("Parsed:", msg);
    handleMessage(msg);
  } catch (e) {
    console.log("Non-JSON message received:", event.data);
  }
      
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
    setGlobalConnection(false);
  };


 const handleMessage = (raw: any) => {
 

  // 1) Parse safely if needed
  let msg = raw;
  try {
    if (typeof raw === "string") {
      msg = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Invalid JSON:", e);
    return;
  }

  // 3) SNAPSHOT: replace state
  if (msg.type === "SNAPSHOT") {
    
   insertReading(msg.data);      //initial insert to DB

    return;
  }

if (msg.type === "DELTA") {
   console.log("Delta:");
   updateReading(msg.data);      //initial insert to DB

    return;
    
  }
};

  return (
    <View style={styles.container}>
       <Text style={styles.title}>📡 Device Logs</Text>
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
   backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    marginTop: 10,
    marginHorizontal:10,
  },
   title: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  msgText: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
  },
});