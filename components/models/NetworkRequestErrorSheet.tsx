import { Platform, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import BottomSheet from "./BottomSheet";
import * as IntentLauncher from "expo-intent-launcher";

interface NetworkRequestErrorSheetProps {
  visible: boolean;
  onDismiss?: ((value: React.SetStateAction<boolean>) => void) | undefined;
}
const NetworkRequestErrorSheet = ({
  visible,
  onDismiss = (value = false) => {},
}: NetworkRequestErrorSheetProps) => {

  const goToSetting = async () => {
      if (Platform.OS == "android") {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.NETWORK_OPERATOR_SETTINGS,
        );
        return;
      }
    };
  return (
    <BottomSheet visible={visible} onDismiss={onDismiss} mode={"center"}>
      <View className="items-center p-5 px-5">
        <Image
          className="h-[70px] w-[70px]"
          source={require("@/assets/images/gif/failed_anim.webp")}
        />
        <Text className="text-center text-lg mt-2 font-bold font-mono">
          Network Disconnected
        </Text>
        <Text className="opacity-70 mt-2 ">
          Please check your network and try again
        </Text>
      </View>
      <View className="p-3 px-10">
        <Button
          onPress={() => onDismiss(false)}
          mode={"contained"}
          className="text-lg p-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
        >
          Dismiss
        </Button>
        <Button
          onPress={goToSetting}
          className="text-lg p-1 mt-5"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="outlined"
        >
          Go to setting
        </Button>
      </View>
    </BottomSheet>
  );
};

export default NetworkRequestErrorSheet;
