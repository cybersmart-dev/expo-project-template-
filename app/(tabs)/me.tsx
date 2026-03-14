import React from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Appbar, List } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

const Me = () => {
  const theme = useTheme();
  const [checked, setChecked] = React.useState(false);
  return (
    <SafeAreaView
      style={{ backgroundColor: theme.colors.background }}
      className="px-3 flex flex-1 justify-center items-center"
    >
      <Appbar
        className="w-screen"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Appbar.Content color="white" title="Profile" />
        <Appbar.Action color="white" icon={"bell"} />
      </Appbar>
      <View className="flex-1">
        <View
          style={{ backgroundColor: theme.colors.primary }}
          className="h-56 rounded-b-3xl w-screen items-center justify-center"
        >
          <View className="items-center space-y-2">
            <Image
              className="h-24 w-24 rounded-full"
              source={require("@/assets/images/profile_avatar.png")}
            />
            <Text className="text-white text-2xl font-bold">
              Mustapha Aminu
            </Text>
            <Text className="text-white opacity-50">
              Software Engineer Security Researcher
            </Text>
          </View>
        </View>

        <View className="px-4 mt-5">
          <List.Section>
            <List.Subheader>Settings</List.Subheader>
            <List.Item
              title="Edit Profile"
              left={() => <List.Icon icon={"pen"} />}
            />
            <List.Item
              title="Change Transaction Pin"
              left={() => <List.Icon icon={"key"} />}
            />
            <List.Subheader>More</List.Subheader>
            <List.Item title="Exit" left={() => <List.Icon icon={"door"} />} />
            <List.Item
              title="Logout"
              left={() => <List.Icon icon={"door-open"} />}
            />
            <List.Item
              className="bg-red-700"
              titleStyle={{ color: "white" }}
              title="Delete Account"
              left={() => <List.Icon color="white" icon={"delete"} />}
            />
          </List.Section>
        </View>
      </View>
      <StatusBar backgroundColor={theme.colors.primary} style="light" />
    </SafeAreaView>
  );
};

export default Me;
