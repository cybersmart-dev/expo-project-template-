import { View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { Button, Text } from "react-native-paper";
import BottomSheet from "./BottomSheet";

interface NetworkRequestErrorSheetProps {
    visible: boolean
    onDismiss?: ((value: React.SetStateAction<boolean>) => void) | undefined
}
const NetworkRequestErrorSheet = ({visible, onDismiss=(value = false) => {}}: NetworkRequestErrorSheetProps) => {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      mode={"center"}
    >
      <View className="items-center p-5 px-5">
        <Image
          className="h-[120px] w-32"
          source={require("@/assets/images/gif/no_connection_anim.gif")}
        />
        <Text className="font-bold mt-2 ">
          Please check your network and try again
        </Text>
      </View>
      <View className="p-3">
        <Button
          onPress={() => onDismiss(false)}
          mode={"contained"}
          className="text-lg p-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
         
        >
          Dismiss
        </Button>
      </View>
    </BottomSheet>
  );
};

export default NetworkRequestErrorSheet;
