const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.send("Welcome client!");

  ws.on("message", function incoming(message) {
    console.log("received request from client:", message.toString());

    ws.send(`Echo: ${message}`);


        // 1. Send initial SNAPSHOT
  ws.send(JSON.stringify({
    type: "SNAPSHOT",
    seq: 0,
    data: {
      temp: 22,
      humidity: 50,
      co2: 400
    }
  }));
  });

  let seq = 0;

  // 2. Send DELTA updates every second
  const interval = setInterval(() => {
    seq++;

    ws.send(JSON.stringify({
      type: "DELTA",
      seq,
      data: {
        temp: 20 + Math.random() * 5,
        humidity: 40 + Math.random() * 20,
        co2: 350 + Math.random() * 300
      }
    }));
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:3000");