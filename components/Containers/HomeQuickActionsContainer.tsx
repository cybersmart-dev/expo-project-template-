import { View, Text } from "react-native";
import React from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";

export const HomeQuickActionsContainer = () => {
  return (
    <View className="flex-row items-center justify-around">
      <ActionButton
        label="Data"
        onPress={() => router.push('/buy-data')}
        icon={() => <FontAwesome name="signal" size={24} color="white" />}
      />
      <ActionButton
        label="Airtime"
        onPress={() => router.push('/buy-airtime')}
        icon={() => <FontAwesome name="mobile" size={24} color="white" />}
      />

      <ActionButton
        icon={() => <Ionicons name="cash-outline" size={24} color="white" />}
        label="Sell Airtime"
      />
    </View>
  );
};
