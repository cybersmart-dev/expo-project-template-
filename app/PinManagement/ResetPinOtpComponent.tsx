import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Keypad from "@/components/Buttons/Keypad";
import OtpInput from "@/components/Inputs/OtpInput";
import { Timer } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import { ActivityIndicator, Text } from "react-native-paper";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";
import { getUserInfo } from "@/constants/UserInfo";

interface ResetPinOtpComponent {
  onOtpValidated: () => void;
  userInfo?: any;
  otpToken?: string;
}
const ResetPinOtpComponent = ({
  onOtpValidated,
  userInfo,
  otpToken,
}: ResetPinOtpComponent) => {
  const [otpValue, setOtpValue] = useState("");
  const [deleteRefreshKey, setDeleteRefreshKey] = useState(0);
  const [validatingOtpProcessing, setValidatingOtpProcessing] = useState(false);

  const handleDelete = () => {
    let value = otpValue.slice(0, otpValue.length - 1);
    setOtpValue(value);
    setDeleteRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (otpValue.length == 4) {
      validateOtp();
    }
  }, [otpValue]);

  const validateOtp = async () => {
    setValidatingOtpProcessing(true);
    const userInfo = await getUserInfo()

    const response = await requests.post({
      url: "/auth/password-less/otp/verify/",
      data: {
        token: otpToken,
        otp: otpValue,
        email: userInfo.email
      },
    });

    setValidatingOtpProcessing(false);
    

    if (response.status == 1) {
      Toast.success({ title: "OTP validated successful" })
      router.push({pathname: "/PinManagement/CreateTransactionPin", params:{token: response.token, action: 'reset'}})
    }

    if (response.status == 0) {
      Toast.danger({title: response?.message})
    }
    
    // onOtpValidated();
  };

  return (
    <View>
      <View className="px-5">
        <View className="m-2 items-center w-full justify-center mb-5 px-3">
          <Text className="opacity-75 text-[13px] text-center">
            We have been send otp to your email address{" "}
            <Text className="font-[ArchivoBlackRegular]">
              {userInfo?.email}
            </Text>
            . dont forget to check spam folder
          </Text>
        </View>
        <View className="px-4">
          <OtpInput
            value={otpValue}
            key={deleteRefreshKey}
            editable={false}
            length={4}
            height={50}
            width={50}
          />
        </View>
      </View>
      <View className="px-5 mt-10">
        <Keypad
          onChange={(digit: string) => {
            setOtpValue((prev) => prev + digit);
          }}
          onDelete={handleDelete}
          onClear={() => {
            setOtpValue("");
            setDeleteRefreshKey((prev) => prev + 1);
          }}
        />
      </View>
      <BottomSheet visible={validatingOtpProcessing}>
        <View className="p-5 flex-col items-center space-y-3">
          <ActivityIndicator />
          <Text>Validating OTP...</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default ResetPinOtpComponent;
