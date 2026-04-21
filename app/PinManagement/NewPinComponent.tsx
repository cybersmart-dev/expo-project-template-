import { View, Text } from "react-native";
import React, { useState } from "react";
import OtpInput from "@/components/Inputs/OtpInput";
import { ActivityIndicator, Button } from "react-native-paper";
import { showMessage } from "react-native-flash-message";
import { Timer } from "@/constants/Utils";
import { router } from "expo-router";

const NewPinComponent = () => {
  const [newPinError, setNewPinError] = useState(false);
  const [newPin2Error, setNewPin2Error] = useState(false);

  const [newPin, setNewPin] = useState("");
  const [newPin2, setNewPin2] = useState("");

  const [pinResetProcessing, setPinResetProcessing] = useState(false);

  const handleReset = async () => {
    if (newPin.length < 4) {
      showMessage({
        message: "Please Enter your new pin",
        type: "danger",
        icon: "danger",
      });
      setNewPinError(true);

      return;
    }

    if (newPin2.length < 4) {
      showMessage({
        message: "Please confirm your new pin",
        type: "danger",
        icon: "danger",
      });
      setNewPin2Error(true);
      setNewPinError(false);

      return;
    }

    if (!newPin.match(newPin2)) {
      showMessage({
        message: "Two new pin most be match",
        type: "danger",
        icon: "danger",
      });
      setNewPinError(true);
      setNewPin2Error(true);
      return;
    }

    setNewPin2Error(false);
    setNewPinError(false);

    confirmReset();
  };

  const confirmReset = async () => {
    setPinResetProcessing(true);
    await new Timer().postDelayedAsync({ sec: 3000 });

    showMessage({
      message: "Pin Reset",
      description: "Pin Reset Successfuly",
      type: "success",
      icon: "success",
      duration: 3000,
    });
    router.back()
    setPinResetProcessing(false);
  };

  return (
    <View className="px-5">
      <View className="space-y-5 ">
        <View className="mb-5 items-center mt-2">
          <Text className="font-bold text-[15px]">Enter your new pin</Text>
          <Text className="text-[12px] opacity-75">
            Your new pin most be diffrent with your old pin
          </Text>
        </View>
        <OtpInput
          editable={!pinResetProcessing}
          length={4}
          height={50}
          width={50}
          onChange={setNewPin}
          error={newPinError}
        />
        <View>
          <OtpInput
            editable={!pinResetProcessing}
            length={4}
            height={50}
            width={50}
            onChange={setNewPin2}
            error={newPin2Error}
          />
        </View>
      </View>
      <View className="mt-8">
        {pinResetProcessing && (
          <Button
            disabled
            className="text-lg p-1"
            style={{ borderRadius: 15 }}
            labelStyle={{ fontSize: 16 }}
            mode="contained"
          >
            <View className="flex-row">
              <Text> </Text>
              <ActivityIndicator size={25} />
            </View>
          </Button>
        )}
        {!pinResetProcessing && (
          <Button
            onPress={handleReset}
            className="text-lg p-1"
            style={{ borderRadius: 15 }}
            labelStyle={{ fontSize: 16 }}
            mode="contained"
          >
            Reset
          </Button>
        )}
      </View>
    </View>
  );
};

export default NewPinComponent;
