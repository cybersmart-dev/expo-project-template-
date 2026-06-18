import { View } from "react-native";
import React, { useCallback } from "react";
import Button from "../Buttons/Button";
import AlertDialog from "./AlertDialog";
import { Text } from "react-native-paper";

interface LogoutAlertDialogProps {
  visible: boolean;
  onDismiss?: ((value: boolean) => void) | undefined;
  username?: string;
  onLogout?: () => void;
}

const LogoutAlertDialog = ({
  visible,
  onDismiss,
  username,
  onLogout,
}: LogoutAlertDialogProps) => {
  const handleDismss = useCallback(() => {
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
            Logout
          </Text>
        </View>

        <View className="px-3 w-full">
          <Text style={{ textAlign: "center" }} className="opacity-75">
            Are you sure do you want to logout from{" "}
            <Text className="opacity-100 font-bold">{username}</Text>
          </Text>
        </View>

        <View className="flex-row px-2 gap-x-3 w-full items-center justify-center mb-3">
          <Button
            backgroundColor={"red"}
            textColor={"white"}
            onPress={onLogout}
          >
            YES
          </Button>
          <Button onPress={handleDismss}>NO</Button>
        </View>
      </View>
    </AlertDialog>
  );
};

export default LogoutAlertDialog;
