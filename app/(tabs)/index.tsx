import EventList from "@/components/EventList";
import Header from "@/components/Header";
import SensorTile from "@/components/SensorTile";
import WebSocketScreen from "@/components/WebSocketScreen";
import { initDB } from "@/components/db";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";


export default function HomeScreen() {
   useEffect(() => {
    initDB(); // ✅ ensure table exists before anything else
  }, []);
   return (
     <ScrollView>
    <View>
      <Header />
      <SensorTile />
      <EventList />
      <WebSocketScreen />
    </View>
    </ScrollView>
  );
}



