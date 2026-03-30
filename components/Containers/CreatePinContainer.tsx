import { View } from "react-native";
import React, { useState } from "react";
import OtpInput from "../Inputs/OtpInput";
import { Button, Text } from "react-native-paper";

interface CreatePinContainerProps {
  onSkip: () => void;
  onCreate: (pin: string) => void;
}
const CreatePinContainer = ({ onSkip, onCreate }: CreatePinContainerProps) => {
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  

  const create = () => {
    if (pin.trim().length < 4 || pin2.trim().length < 4) {
      alert("Pin len error");
      return;
      }
      if (pin != pin2) {
          alert('Pin Match Error')
          return
      }
      onCreate(pin)
  };

  return (
    <View className="m-3 mt-5 space-y-5 mb-7">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg sans-sarif">Create Transaction Pin</Text>
      </View>
      <View className="space-y-2">
        <Text className="mb-2 ml-3 opacity-60 text-[11px]">
          Transaction Pin
        </Text>
        <OtpInput length={4} onChange={setPin} />
      </View>

      <View className="space-y-2">
        <Text className="mb-2 ml-3 opacity-60 text-[11px]">
          Enter pin again
        </Text>
        <OtpInput length={4} onChange={setPin2} />
      </View>
      <View className="mt-5 pt-10 px-6 space-y-4">
        <Button onPress={create} mode="contained">
          Create Now
        </Button>
        <Button onPress={onSkip} mode="outlined">
          Skip
        </Button>
      </View>
      
    </View>
  );
};

export default CreatePinContainer;
