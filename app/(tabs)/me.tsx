import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  StatusBar as RNStatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { router, useFocusEffect } from "expo-router";

const Me = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );
  return (
    <View
      style={{ backgroundColor: theme.colors.background }}
      className="px-3 flex flex-1 justify-center items-center"
    >
      <Appbar
        className="w-screen"
        style={{
          backgroundColor: theme.colors.primary,
          paddingTop: RNStatusBar.currentHeight,
        }}
      >
        <Appbar.Content color="white" title="Profile" />
        <Appbar.Action onPress={() => router.push('/notifications')} color="white" icon={"bell"} />
      </Appbar>
      <ScrollView className='flex-1 w-screen'>
        <View className="flex-1">
          <View
            style={{ backgroundColor: theme.colors.primary }}
            className="h-56 rounded-b-lg w-screen items-center justify-center"
          >
            <View className="items-center space-y-2">
              <EaseView
                animate={{
                  opacity: loaded ? 1 : 0,
                  translateY: loaded ? 0 : -20,
                }}
                transition={{ duration: 300, type: "timing" }}
              >
                <Image
                  className="h-20 w-20 rounded-full"
                  source={require("@/assets/images/profile_avatar.png")}
                />
              </EaseView>
              <EaseView
                animate={{
                  opacity: loaded ? 1 : 0,
                  translateY: loaded ? 0 : -20,
                }}
                transition={{ duration: 300, type: "timing", delay: 200 }}
              >
                <Text className="text-white text-2xl font-bold">
                  Mustapha Aminu
                </Text>
              </EaseView>
              <EaseView
                animate={{
                  opacity: loaded ? 1 : 0,
                  translateY: loaded ? 0 : -20,
                }}
                transition={{ duration: 300, type: "timing", delay: 400 }}
              >
                <Text className="text-white opacity-50">
                  Software Engineer Security Researcher
                </Text>
              </EaseView>
            </View>
          </View>

          <View className="px-4 mt-5">
            <List.Section>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Edit Profile"
                left={() => <List.Icon icon={"account-edit"} />}
              />
              <List.Item
                title="Pin Management"
                left={() => <List.Icon icon={"key"} />}
              />
              <List.Item
                title="Check For Update"
                left={() => <List.Icon icon={"android"} />}
              />
              <List.Subheader>More</List.Subheader>

              <List.Item
                title="Exit"
                left={() => <List.Icon icon={"door"} />}
              />

              <List.Item
                title="Logout"
                onPress={() => router.push('/logins/emailLogin')}
                titleStyle={{ color: "red" }}
                left={() => <List.Icon color="red" icon={"door-open"} />}
              />
              <List.Item
                titleStyle={{ color: "red" }}
                title="Delete Account"
                left={() => <List.Icon color="red" icon={"delete"} />}
              />
            </List.Section>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

export default Me;
