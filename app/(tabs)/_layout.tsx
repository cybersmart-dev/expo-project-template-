import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, StatusBar as RNStatusBar, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { IconButton, useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarStyle: {
            paddingBottom: 0,
            height: 60,
            borderTopWidth: 0,
            borderRadius: 50,
            elevation: 10,
          },
          
          tabBarBackground: () => (
            <View
              style={{
                backgroundColor: theme.colors.background,
                padding: 5,
                //height: 60,
              }}
              className="flex-1 h-fit bg-transparent"
            ></View>
          ),
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
           
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transactions",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="history"
                size={size}
                color={color}
              />
            ),
          }}
        />
        

        <Tabs.Screen
          name="me"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <StatusBar style="auto" />
      </Tabs>
    </SafeAreaView>
  );
}
