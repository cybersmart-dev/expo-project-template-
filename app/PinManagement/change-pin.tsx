import { View, Keyboard } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  ActivityIndicator,
  Appbar,
  Button,
  useTheme,
  Text
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import OtpInput from "@/components/Inputs/OtpInput";
import { showMessage } from "react-native-flash-message";
import BottomSheet from "@/components/models/BottomSheet";
import { Timer } from "@/constants/Utils";

const chanepin = () => {
  const theme = useTheme();
  const [oldPin, setoldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPin2, setNewPin2] = useState("");

  const [oldPinError, setOldPinError] = useState(false);
  const [newPinError, setNewPinError] = useState(false);
  const [newPin2Error, setNewPin2Error] = useState(false);
  const [processingVisible, setProcessingVisible] = useState(false);

  
  const handleChange = async () => {
    if (oldPin.length < 4) {
      showMessage({
        message: "Please Enter your current pin",
        type: "danger",
        icon: "danger",
      });
      setOldPinError(true);
      return;
    }

    if (newPin.length < 4) {
      showMessage({
        message: "Please Enter your new pin",
        type: "danger",
        icon: "danger",
      });
      setNewPinError(true);
      setOldPinError(false);
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
      setOldPinError(false);
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
    setOldPinError(false);

    confirmChange();
  };

  const confirmChange = async () => {
    setProcessingVisible(true);
    await new Timer().postDelayedAsync({ sec: 3000 });
    setProcessingVisible(false);
    showMessage({
      message:"Pin Changed",
      description: "Pin Changed Successfuly",
      type: "success",
      icon: "success",
      duration: 3000,
    });
    router.push('/(tabs)')
  };

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

          <Appbar.Content title="Change Pin" />
        </Appbar>

        <View className="px-5">
          <View className="space-y-5 mt-3">
            <Text className="mb-5 font-bold text-[15px]">
              Enter your current pin
            </Text>
            <OtpInput
              length={4}
              height={50}
              width={50}
              onChange={setoldPin}
              error={oldPinError}
            />
          </View>

          <View className="space-y-5 mt-5">
            <View className="mb-5">
              <Text className="font-bold text-[15px]">Enter your new pin</Text>
              <Text className="text-[12px] opacity-75">
                Your new pin most be diffrent with your old pin
              </Text>
            </View>
            <OtpInput
              length={4}
              height={50}
              width={50}
              onChange={setNewPin}
              error={newPinError}
            />
            <View>
              <OtpInput
                length={4}
                height={50}
                width={50}
                onChange={setNewPin2}
                error={newPin2Error}
              />
            </View>
          </View>
          <View className="mt-8">
            <Button
              onPress={handleChange}
              className="text-lg p-1"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode="contained"
            >
              Chnage
            </Button>
          </View>
        </View>
      </View>

      <BottomSheet visible={processingVisible}>
        <View className="p-14">
          <View className="items-center justify-center gap-2">
            <ActivityIndicator size={30} />
            <Text>Please wait...</Text>
          </View>
        </View>
      </BottomSheet>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default chanepin;
