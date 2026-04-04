import { View } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, useTheme, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const earning = () => {
  const theme = useTheme()
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
      </View>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default earning;
