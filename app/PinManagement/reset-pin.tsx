import { Keyboard, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import BottomSheet from "@/components/models/BottomSheet";
import { Timer } from "@/constants/Utils";
import OtpInput from "@/components/Inputs/OtpInput";
import Keypad from "@/components/Buttons/Keypad";
import { showMessage } from "react-native-flash-message";
import ResetPinOtpComponent from "./ResetPinOtpComponent";
import NewPinComponent from "./NewPinComponent";

const resetpin = () => {
  const theme = useTheme();

  const [otpSend, setOtpSend] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    await new Timer().postDelayedAsync({ sec: 3000 });
    setOtpSend(true);
    setSendingOtp(false);
  };

  const confirmResetPin = async () => {
   
  };

  if (!otpSend) {
    return (
      <View>
        <BottomSheet mode={"center"}>
          {!sendingOtp && (
            <View>
              <View className="p-3 px-5">
                <Text className="text-lg ">Reset pin</Text>
              </View>
              <View className="p-3 px-4">
                <Text>
                  We will send otp to your email address example@gmail.com
                </Text>
              </View>
              <View className="flex-row p-3 justify-end w-full space-x-3">
                <Button
                  onPress={() => {
                    router.back();
                    setOtpSend(true);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleSendOtp}
                  mode={"contained-tonal"}
                  className=""
                >
                  Continue
                </Button>
              </View>
            </View>
          )}
          {sendingOtp && (
            <View className="p-5 flex-col items-center space-y-3">
              <ActivityIndicator />
              <Text>Sending OTP...</Text>
            </View>
          )}
        </BottomSheet>
      </View>
    );
  }

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <View>
        <Appbar className="bg-transparent" collapsable={true}>
          <Appbar.Action
            isLeading
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />

          <Appbar.Content title="Reset Pin" />
        </Appbar>

        <View className="">
          {!otpValidated && (
            <ResetPinOtpComponent
              onOtpValidated={() => setOtpValidated(true)}
            />
          )}
          {otpValidated && <NewPinComponent />}
        </View>
      </View>

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default resetpin;
