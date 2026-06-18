import { View } from "react-native";
import React, { useCallback } from "react";
import AlertDialog from "./AlertDialog";
import Button from "../Buttons/Button";
import { Text } from "react-native-paper";

interface GoBackAlertDialogProps {
  visible: boolean;
  onDismiss?: ((value: boolean) => void) | undefined;
  title?: string;
  description?: string;
  onBack?: () => void;
}

const GoBackAlertDialog = ({
  visible,
  onBack,
  onDismiss,
  title = "Go Back",
  description = "Are you sure do you want to go back",
}: GoBackAlertDialogProps) => {
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(false);
    }
  }, []);

  return (
    <AlertDialog visible={visible} onDismiss={onDismiss}>
      <View className="h-full flex-1 justify-between">
        <View className="items-center w-full mt-2">
          <Text
            style={{ fontFamily: "ArchivoBlackRegular" }}
            className="font-bold  text-2xl uppercase"
          >
            {title}
          </Text>
        </View>

        <View className="px-3 w-full">
          <Text style={{ textAlign: "center" }} className="opacity-75">
            {description}
          </Text>
        </View>

        <View className="flex-row px-2 gap-x-3 w-full items-center justify-center mb-3">
          <Button backgroundColor={"red"} textColor={"white"} onPress={onBack}>
            YES
          </Button>
          <Button onPress={handleDismiss}>NO</Button>
        </View>
      </View>
    </AlertDialog>
  );
};

export default GoBackAlertDialog;
