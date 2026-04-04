import {
  View,
} from "react-native";
import React, { useState } from "react";
import BottomSheet from "./BottomSheet";
import OtpInput from "../Inputs/OtpInput";
import { ActivityIndicator, Button, Text } from "react-native-paper";

interface TransactionPinSheetProps {
  title?: string;
  description?: string;
  visible: boolean;
  onCancel: () => void;
  onComplate: (pin: string) => void;
  processingTransaction?: boolean;
  isTransactionPinSheet?: boolean;
  digits?: number;
  sheetMode?: "center" | "full-width" | "dailog" | undefined;
}
const TransactionPinSheet = ({
  title = "Verify Your Pin",
  description = "Enter your transaction pin to continue",
  visible,
  onCancel,
  onComplate,
  processingTransaction = false,
  isTransactionPinSheet = true,
  digits = 4,
  sheetMode = "center",
}: TransactionPinSheetProps) => {
  const [cancelProcessing, setCancelProcessing] = useState(false);
  

  const handleCancel = async () => {
    onCancel()
  };
  return (
    <BottomSheet style={{}} mode={sheetMode} visible={visible} height={"auto"}>
      {processingTransaction && (
        <View
          style={{ paddingVertical: "16.5%" }}
          className="items-center justify-center h-full space-y-3"
        >
          <ActivityIndicator />
          <Text>Processing</Text>
        </View>
      )}
      {!processingTransaction && (
        <View className="py-5">
          <View className="px-5">
            <Text className="text-lg">{title}</Text>
            <Text className="text-[12px] opacity-75">{description}</Text>
          </View>

          <View className="mt-5 px-5">
            <OtpInput autoFocus length={digits} onComplete={onComplate} />
            <View className="mt-5 flex-row items-center justify-between">
              {isTransactionPinSheet && (
                <Button labelStyle={{ textDecorationLine: "underline" }}>
                  Forgot Pin?
                </Button>
              )}
              {cancelProcessing && (
                <Button
                  buttonColor="red"
                  textColor="white"
                  onPress={handleCancel}
                  mode="contained-tonal"
                >
                  Stop
                </Button>
              )}
              {!cancelProcessing && (
                <Button onPress={handleCancel} mode="contained-tonal">
                  Cancel
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

export default TransactionPinSheet;
