import { Alert, BackHandler, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BottomSheet from "./BottomSheet";
import OtpInput from "../Inputs/OtpInput";
import {
  ActivityIndicator,
  Button,
  FAB,
  IconButton,
  Text,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCounter } from "@/constants/Hooks";

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
  sheetType?: "transactionPin" | "otpVerification";
  onOtpResend?: () => void;
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
  sheetType = "transactionPin",
  onOtpResend,
}: TransactionPinSheetProps) => {
  const [cancelProcessing, setCancelProcessing] = useState(false);
  const { resendCount, startCounter } = useCounter({ count: 30 });

  const handleCancel = async () => {
    onCancel();
  };

  const fingerprintLogin = async () => {
    // Check if biometric hardware is available
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(
        "Not supported",
        "This device does not have biometric hardware.",
      );
      return;
    }

    // Check if biometric records are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        "No biometrics set up",
        "Please set up a fingerprint or face scan in your device settings.",
      );
      return;
    }

    // Authenticate the user
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to unlock the app",
      cancelLabel: "Use Password",
      promptSubtitle: "Login with biometric",
    });

    if (result.success) {
      const pin = await getUserPin();
      console.log("User Pin", pin);

      onComplate(pin);
    } else {
      showMessage({
        message: "Failed",
        description: "Authentication failed: " + result.error,
        type: "danger",
        icon: "danger",
      });
      // Handle authentication failure
    }
  };

  const getUserPin = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        return userInfo.transaction_pin;
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (sheetType === "otpVerification") {
      startCounter();
    }
  }, [visible]);

  return (
    <BottomSheet
      outterChildrenStyle={{ paddingBottom: 50 }}
      outterChildrenSpace={70}
      style={{}}
      mode={sheetMode}
      visible={visible}
      height={"auto"}
      onDismiss={() =>
        Alert.alert(
          "Close",
          "Are you sure do you want to close current transaction",
          [
            { text: "Yes", onPress: () => onCancel() },
            { text: "NO", onPress: () => null },
          ],
        )
      }
    >
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
        <View className="py-4">
          <View className="px-5 flex-row justify-between">
            <View>
              <Text className="text-lg">{title}</Text>
              <Text className="text-[12px] opacity-75">{description}</Text>
            </View>
          </View>

          <View className="mt-5 px-5">
            <OtpInput autoFocus length={digits} onComplete={onComplate} />
            {sheetType === "otpVerification" && (
              <View className="mt-3 flex-row items-center space-x-2">
                <Text className="text-[12px] opacity-75">
                  Didn't receive code?
                </Text>
                {resendCount <= 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (onOtpResend) {
                        onOtpResend();
                        startCounter();
                      }
                    }}
                  >
                    <Text className="text-[12px] text-blue-500">
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-[12px] opacity-75">
                    Resend code in {resendCount}s
                  </Text>
                )}
              </View>
            )}
            <View className="mt-5 flex-row items-center justify-between">
              {isTransactionPinSheet && (
                <Button
                  onPress={() => router.push("/PinManagement/reset-pin")}
                  labelStyle={{ textDecorationLine: "underline" }}
                >
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
              {!cancelProcessing && isTransactionPinSheet && (
                <FAB
                  onPress={fingerprintLogin}
                  className="bottom-0"
                  icon={"fingerprint"}
                  size={"medium"}
                  elevation={0}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

export default TransactionPinSheet;
