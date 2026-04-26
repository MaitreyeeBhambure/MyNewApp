import EventList from "@/components/EventList";
import Header from "@/components/Header";
import SensorTile from "@/components/SensorTile";
import WebSocketScreen from "@/components/WebSocketScreen";
import { View } from "react-native";


export default function HomeScreen() {
   return (
    <View>
      <Header />
      <SensorTile type="temp" />
      <SensorTile type="humidity" />
      <SensorTile type="co2" />
      <EventList />
      <WebSocketScreen />
    </View>
  );
}



