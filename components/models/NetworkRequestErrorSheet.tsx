import { Platform, View } from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import BottomSheet from "./BottomSheet";
import * as IntentLauncher from "expo-intent-launcher";
import * as Haptics from "expo-haptics";

interface NetworkRequestErrorSheetProps {
  visible: boolean;
  onDismiss?: ((value: React.SetStateAction<boolean>) => void) | undefined;
}
const NetworkRequestErrorSheet = ({
  visible,
  onDismiss = (value = false) => {},
}: NetworkRequestErrorSheetProps) => {

  useEffect( () => {
    if (visible) {
      (async function(){
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      })()
    }
  }, [visible])
  

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
      <View className="items-center p-5 px-5 mb-5">
        <Image
          style={{height:70, width: 70}}
          source={require("@/assets/images/gif/failed_anim.webp")}
        />
        <Text className="text-center text-lg mt-2 font-bold font-mono">
          Network Disconnected
        </Text>
        <Text className="opacity-70 mt-2 ">
          Please check your network and try again
        </Text>
      </View>
      <View className="p-3 px-10 mb-5">
        <Button
          onPress={() => onDismiss(false)}
          mode={"contained"}
          className="text-lg py-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
        >
          Dismiss
        </Button>
        <Button
          onPress={goToSetting}
          className="text-lg py-1 mt-5"
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
