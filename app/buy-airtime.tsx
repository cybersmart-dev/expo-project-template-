import { View } from "react-native";
import React from "react";
import { Appbar, Text } from "react-native-paper";
import { PaperSafeView } from "@/components/PaperView";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const buyairtime = () => {
  return (
    <PaperSafeView className="flex-1 ">
      <Appbar>
        <Appbar.Action
          isLeading
          icon={() => (
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
          )}
          onPress={() => router.back()}
        />
        <Appbar.Content title="Buy Airtime" />
        
        <Appbar.Action
          icon={() => (
            <MaterialIcons name="contact-support" size={24} color="black" />
          )}
        />
      </Appbar>
      <View className="flex-1 items-center justify-center">
        <Text>Buy Airtime Screen</Text>
      </View>
    </PaperSafeView>
  );
};

export default buyairtime;
