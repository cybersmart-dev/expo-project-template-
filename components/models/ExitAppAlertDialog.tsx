import { View, BackHandler } from "react-native";
import React, { useCallback } from "react";
import AlertDialog from "./AlertDialog";
import Button from "../Buttons/Button";
import { Text } from "react-native-paper";

interface ExitAppAlertDialogProps {
  visible: boolean;
  onDismiss?: ((value: boolean) => void) | undefined;
}
const ExitAppAlertDialog = ({
  visible,
  onDismiss,
}: ExitAppAlertDialogProps) => {
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(false);
    }
  }, []);

  return (
    <AlertDialog onDismiss={onDismiss} visible={visible}>
      <View className="h-full flex-1 justify-between">
        <View className="items-center w-full mt-2">
          <Text
            style={{ fontFamily: "ArchivoBlackRegular" }}
            className="font-bold  text-2xl uppercase"
          >
            Exit
          </Text>
        </View>

        <View className="px-3 w-full">
          <Text style={{ textAlign: "center" }} className="opacity-75">
            Are you sure do you want to exit from this app
          </Text>
        </View>

        <View className="flex-row px-2 gap-x-3 w-full items-center justify-center mb-3">
          <Button
            backgroundColor={"red"}
            textColor={"white"}
            onPress={() => BackHandler.exitApp()}
          >
            YES
          </Button>
          <Button onPress={handleDismiss}>NO</Button>
        </View>
      </View>
    </AlertDialog>
  );
};

export default ExitAppAlertDialog;
