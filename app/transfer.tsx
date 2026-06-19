import { View } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, Text, useTheme } from "react-native-paper";
import CustomAppbar from "@/components/CustomAppbar";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const transfer = () => {
  const theme = useTheme();
  return (
    <PaperSafeView>
      <CustomAppbar>
        <Appbar.Action
          onPress={() => router.back()}
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />
        <Appbar.Content
          color="white"
          title={<Text className="text-lg font-bold">Transfer</Text>}
        />
      </CustomAppbar>
      <Text>transfer</Text>
    </PaperSafeView>
  );
};

export default transfer;
