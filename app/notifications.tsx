import { View } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { StatusBar } from "expo-status-bar";
import { Appbar, Button, useTheme, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { EaseView } from "react-native-ease";

const notifications = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("1");

  return (
    <PaperSafeView>
      <View>
        <Appbar className="bg-transparent" collapsable={true}>
          <Appbar.Action
            isLeading
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />

          <Appbar.Content title="Notifications" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>

        <View className="p-2 flex-row items-center justify-around">
          <Button
            onPress={() => setActiveTab("1")}
            className="rounded-none"
            style={{
              borderBottomColor:
                activeTab == "1" ? theme.colors.primary : "transparent",
              borderWidth: 1,
            }}
          >
            All
          </Button>
          <Button
            className="rounded-none"
            style={{
              borderBottomColor:
                activeTab == "2" ? theme.colors.primary : "transparent",
              borderWidth: 1,
            }}
            onPress={() => setActiveTab("2")}
          >
            Service
          </Button>
          <Button
            className="rounded-none"
            style={{
              borderBottomColor:
                activeTab == "3" ? theme.colors.primary : "transparent",
              borderWidth: 1,
            }}
            onPress={() => setActiveTab("3")}
          >
            Transactions
          </Button>
        </View>
      </View>

      <View className="h-full w-full relative">
        <EaseView
          animate={{
            scale: activeTab == "1" ? 1 : 0.1,
            opacity: activeTab == "1" ? 1 : 0,
          }}
          transition={{type:'timing', duration: 1000}}
          className="absolute h-full w-full"
        >
          <View className='flex-1 items-center justify-center'>
            <Text className='text-3xl'>All</Text>
          </View>
        </EaseView>

        <EaseView
          animate={{
            scale: activeTab == "2" ? 1 : 0.1,
            opacity: activeTab == "2" ? 1 : 0,
          }}
          transition={{type:'timing', duration: 1000}}
          className="absolute h-full w-full"
        >
           <View className='flex-1 items-center justify-center'>
            <Text className='text-3xl'>Service</Text>
          </View>
        </EaseView>

        <EaseView
          animate={{
            scale: activeTab == "3" ? 1 : 0.1,
            opacity: activeTab == "3" ? 1 : 0,
          }}
          transition={{type:'timing', duration: 1000}}
          className="absolute h-full w-full "
        >
           <View className='flex-1 items-center justify-center'>
            <Text className='text-3xl'>Transactions</Text>
          </View>
        </EaseView>
      </View>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default notifications;
