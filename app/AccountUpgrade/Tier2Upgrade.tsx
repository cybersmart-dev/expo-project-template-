import { View } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import CustomAppbar from "@/components/CustomAppbar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Appbar, useTheme, Text } from "react-native-paper";

const Tier2Upgrade = () => {
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
          title={<Text className="text-lg font-bold">Upgrade To Tier 2</Text>}
        />
      </CustomAppbar>
    </PaperSafeView>
  );
};

export default Tier2Upgrade;
