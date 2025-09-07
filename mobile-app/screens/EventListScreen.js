import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";

// 👇 Replace with your backend machine IP when running on a physical device
const API = "http://192.168.0.100:4000/api"; // Android emulator (localhost)
// iOS simulator can use http://localhost:4000/api
// Physical device: replace with your PC's LAN IP (e.g., http://192.168.1.5:4000/api)

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/events`)
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.text();
      })
      .then((text) => (text ? JSON.parse(text) : []))
      .then((data) => {
        setEvents(data);
        console.log('Fetched events:', data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { event: item })}
          >
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.title}
              </Text>
              <Text>
                {item.event_type} •{" "}
                {new Date(item.start_time).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
