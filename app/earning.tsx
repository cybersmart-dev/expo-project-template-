import { View, Text } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const earning = () => {
  return (
    <PaperSafeView>
      <View>
        <Appbar collapsable={true}>
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
      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default earning;
