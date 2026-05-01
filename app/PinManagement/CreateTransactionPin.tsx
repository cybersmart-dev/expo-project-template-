import { Keyboard, Pressable, View } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, useTheme, Text, Button, Icon, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import OtpInput from "@/components/Inputs/OtpInput";
import Keypad from "@/components/Buttons/Keypad";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";

const CreateTransactionPin = () => {
  const theme = useTheme();
  const [userPin, setUserPin] = useState("");
  const [userPin2, setUserPin2] = useState("");

  const [userPinError, setUserPinError] = useState(false);
  const [userPin2Error, setUserPin2Error] = useState(false);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  const [showPin, setShowPin] = useState(true);

   const [showProcessing, setShowProcessing] = useState(false);

  const handleConfirm = async () => {
    if (userPin.length <= 3) {
      setUserPinError(true);
      Toast.danger({ title: "Your transaction pin length most be 4" });
      return;
    }
    if (userPin2.length <= 3) {
      setUserPinError(false);
      setUserPin2Error(true);
      Toast.danger({ title: "Your transaction pin length most be 4" });
      return;
    }
    if (userPin.trim() != userPin2.trim()) {
      setUserPinError(true);
      setUserPin2Error(true);
      Toast.danger({ title: "All two inputs most be match" });
      return;
    }

    setUserPinError(false);
    setUserPin2Error(false);

    setShowProcessing(true)
    const response = await requests.post({
      url: "/user/payment/create-pin/",
      data: { pin: userPin },
    });

    setShowProcessing(false)

    if (response.status == 0) {
      Toast.danger({ title: response?.message });
    }
    if (response.status == 1) {
      Toast.success({ title: response?.message });
      router.push("/(tabs)")
    }
    if (response.status == undefined) {
      setNetworkErrorSheetVisible(true);
    }
  };
  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <Appbar className="bg-transparent">
        <Appbar.Action
          onPress={() => router.back()}
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />

        <Appbar.Content title="Transaction Pin" />
      </Appbar>
      <View>
        <Text className="text-center mt-5 text-lg font-bold uppercase">
          Create Your Transaction Pin
        </Text>

        <View className="p-5">
          <View className="rounded-lg" style={{}}>
            <View className="px-5 mt-5">
              <View className="flex-row items-center space-x-2 mb-2">
                <Text className="mb-2 ml-2">Enter your transaction pin</Text>
                <Pressable onPress={() => setShowPin(!showPin)}>
                  <Icon size={20} source={showPin ? "eye" : "eye-off"} />
                </Pressable>
              </View>
              <OtpInput
                error={userPinError}
                onChange={setUserPin}
                height={50}
                width={50}
                length={4}
                secureTextEntry={showPin}
                editable={!showProcessing}
              />
            </View>

            <View className="mt-5 px-5 pb-5">
              <Text className="mb-2 ml-2">Confirm your pin</Text>
              <OtpInput
                error={userPin2Error}
                onChange={setUserPin2}
                height={50}
                width={50}
                length={4}
                secureTextEntry={showPin}
                 editable={!showProcessing}
              />
            </View>
          </View>
          <View className="px-5 pt-5">
            {showProcessing && (
              <Button
                disabled
                onPress={handleConfirm}
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

            {!showProcessing && (
              <Button
                onPress={handleConfirm}
                className="text-lg p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
                mode="contained"
              >
                Confirm
              </Button>
            )}
          </View>
        </View>
      </View>
      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />
    </PaperSafeView>
  );
};

export default CreateTransactionPin;
