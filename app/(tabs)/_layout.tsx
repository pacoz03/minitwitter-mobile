import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: "#1d9bf0",
        tabBarInactiveTintColor: "#71767b",
        tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: '#333333',
        },
        headerStyle: {
            backgroundColor: '#000000',
            borderBottomColor: '#333333',
            borderBottomWidth: 1,
        },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}