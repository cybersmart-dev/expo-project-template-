import { Share, View } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, useTheme, Text, Button } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { showMessage } from "react-native-flash-message";
import { shareAsync } from "expo-sharing";

const earning = () => {
  const theme = useTheme();

  const Copy = async (text: string) => {
    showMessage({
      message: "Copied",
      type: "success",
      icon: "success",
    });
  };

  const shareLink = async () => {
    const link = "https://example.com";
    Share.share(
      { message: link, title: "Share Invitation code" },
      { dialogTitle: "Share Invitation code" },
    );
  };
  return (
    <PaperSafeView>
      <View>
        <Appbar className="bg-transparent" collapsable={true}>
          <Appbar.Action
            isLeading
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={size}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />

          <Appbar.Content title="Earning" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
        <View>
          <View className="px-5 pt-5 mt-5">
            <Button
              icon={"share-variant"}
              onPress={shareLink}
              className="text-lg p-1"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode="contained"
            >
              Invide Friends
            </Button>
            <View className="flex-row items-center justify-evenly mt-5">
              <Button
                onPress={() => Copy("hello")}
                icon={"content-copy"}
                mode={"outlined"}
              >
                Copy Code
              </Button>
              <Button
                onPress={() => Copy("hello")}
                icon={"link"}
                mode={"outlined"}
              >
                Copy Link
              </Button>
            </View>
          </View>
        </View>
      </View>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default earning;
