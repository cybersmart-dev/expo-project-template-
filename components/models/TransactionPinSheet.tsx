import {
  View,
  Text,
  StatusBar as RNStatusbar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import BottomSheet from "./BottomSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import OtpInput from "../Inputs/OtpInput";
import { ActivityIndicator, Button } from "react-native-paper";

interface TransactionPinSheetProps {
  title?: string
  description?: string
  visible: boolean;
  onCancel: () => void;
  onComplate: (pin: string) => void;
  processingTransaction?: boolean;
  isTransactionPinSheet?: boolean;
  digits?: number;
  sheetMode?: "center" | "full-width" | "dailog" | undefined
}
const TransactionPinSheet = ({
  title = 'Verify Your Pin',
  description = 'Enter your transaction pin to continue',
  visible,
  onCancel,
  onComplate,
  processingTransaction = false,
  isTransactionPinSheet = true,
  digits = 4,
  sheetMode = 'center'
  
}: TransactionPinSheetProps) => {
  return (
    <BottomSheet  style={{}} mode={sheetMode} visible={visible} height={"auto"}>
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
            <Text className="text-lg">{ title}</Text>
            <Text className="text-[12px] opacity-75">
              {description}
            </Text>
          </View>

          <View className="mt-5 px-5">
            <OtpInput autoFocus length={digits} onComplete={onComplate} />
            <View className="mt-5 flex-row items-center justify-between">
              {isTransactionPinSheet && <Button>Forgot Pin ?</Button>}
              <Button onPress={onCancel} mode="contained">
                Cancel
              </Button>
            </View>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

export default TransactionPinSheet;
