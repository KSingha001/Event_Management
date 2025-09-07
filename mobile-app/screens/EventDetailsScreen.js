import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";

const API = "http://10.0.2.2:4000/api";

export default function EventDetailsScreen({ route }) {
  const { event } = route.params;

  async function register() {
    try {
      const resp = await fetch(`${API}/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: {
            college_id: 1,
            name: "Expo User",
            email: "expo_user@example.com",
            roll_no: "EX123",
          },
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        Alert.alert("Success", "Registered successfully!");
      } else {
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network error");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>
        {event.event_type} • {new Date(event.start_time).toLocaleString()}
      </Text>
      <Button title="Register" onPress={register} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
});
