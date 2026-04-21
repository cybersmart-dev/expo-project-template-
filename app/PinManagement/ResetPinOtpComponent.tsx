import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Keypad from "@/components/Buttons/Keypad";
import OtpInput from "@/components/Inputs/OtpInput";
import { Timer } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import { ActivityIndicator } from "react-native-paper";

interface ResetPinOtpComponent {
  onOtpValidated: () => void;
}
const ResetPinOtpComponent = ({ onOtpValidated }: ResetPinOtpComponent) => {
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
    await new Timer().postDelayedAsync({ sec: 3000 });
    setValidatingOtpProcessing(false);

    onOtpValidated();
  };

  return (
    <View>
      <View className="px-5">
        <View className="m-2 items-center w-full justify-center mb-5">
          <Text className="opacity-75 text-[12px] text-center">
            We have been send otp to your email address example@gmail.com. dont
            forget to check spam folder
          </Text>
        </View>
        <OtpInput
          value={otpValue}
          key={deleteRefreshKey}
          editable={false}
          length={4}
          height={50}
          width={50}
        />
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
