import { Keyboard, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import requests from "@/Network/HttpRequest";
import { getUserInfo } from "@/constants/UserInfo";
import { maskEmail } from "@/constants/Formats";
import { Toast } from "@/constants/Toast";
import CustomAppbar from "@/components/CustomAppbar";

const resetpin = () => {
  const theme = useTheme();

  const [otpSend, setOtpSend] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);
  const [userInfo, setuserInfo] = useState<any>();
  const [otpToken, setOtpToken] = useState<string | undefined>("")
  const [sendErrorMessage, setSendErrorMessage] = useState<string | undefined>("")

  useEffect(useCallback(() => { 
    loadUserInfo()
  }, []));
  

  const loadUserInfo = async () => {
    const info = await getUserInfo()
    setuserInfo(info)
  }

  const handleSendOtp = async () => {
    setSendingOtp(true);
    const response = await requests.post({
      url: "/auth/password-less/otp/send/",
      data: {
        email: userInfo?.email,
      },
    });
    
    setSendingOtp(false);

    if (response.status == 0) {
      setSendErrorMessage(response?.message)
      Toast.danger({title: response?.message})
    }

    if (response.status == 1) {
      setOtpSend(true);
      setOtpToken(response?.token)
    }
    if (response.status == undefined) {
      setSendErrorMessage(response?.message)
      Toast.danger({title: response?.message})
    }
  };

  const confirmResetPin = async () => {};

  if (!otpSend) {
    return (
      <PaperSafeView>
        <BottomSheet mode={"center"}>
          {!sendingOtp && (
            <View>
              <View className="p-3 px-5">
                <Text className="text-lg ">Reset pin</Text>
              </View>
             
              <View className="p-3 px-4">
                {sendErrorMessage?.trim() != "" && (
                  <Text className="mb-2 text-red-400 text-[13px]">{sendErrorMessage }</Text>
                 )}
                <Text>
                  We will send otp to your email address <Text className="font-[ArchivoBlackRegular]">{userInfo?.email}</Text>
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
      </PaperSafeView>
    );
  }

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <View>
        <CustomAppbar >
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
        </CustomAppbar>

        <View className="">
          {!otpValidated && (
            <ResetPinOtpComponent
              otpToken={otpToken}
              onOtpValidated={() => setOtpValidated(true)}
              userInfo={userInfo}
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
