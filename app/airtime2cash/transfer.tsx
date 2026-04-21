import { View, Keyboard, Platform, Linking } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, Button, TextInput, useTheme, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { formatNumber } from "@/constants/Formats";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { toNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import * as IntentLauncher from "expo-intent-launcher";
import { Image } from "expo-image";

const transfer = () => {
  const theme = useTheme();
  const [transferSheetVisible, setTransferSheetVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const { number, token } = useLocalSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [sharePin, setSharePin] = useState("");

  const handleContinue = () => {
    if (toNumber(amount) < 100) {
      showMessage({
        message: "Minimum Amount is 100",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!sharePin) {
      showMessage({
        message: "Please Enter Your share pin",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    setTransferSheetVisible(true);
  };

  const handleConvert = (pin: string) => {
    setTransferSheetVisible(false);
    router.push({
      pathname: "/modals/transfer_response",
      params: {
        status: "Success",
        type: "Deposit",
        amount: amount,
        data: JSON.stringify({
          statusCode: 1,
          type: "transfer",
          phone: number,
          id: 1,
          charge: 0.0,
          cashback: 0.4,
          message: `You have successfuly convert ${amount} of airtime`,
        }),
      },
    });
  };

  const handleCreatePin = async () => {
    if (Platform.OS === "android") {
      const supported = await Linking.canOpenURL("tel:");

      if (supported) {
        await Linking.openURL("tel:" + encodeURIComponent("*321#"));
      } else {
        showMessage({
          message: "Dialer not supported",
          type: "danger",
          icon: "danger",
        });
      }
    }
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

          <Appbar.Content title="Sell Airtime" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>

        <View>
          <View className="px-5 my-5">
            <View className="items-center space-y-2">
              <Text>Airtime Balance</Text>
              <Text className="text-3xl"> ₦{formatNumber(15000)}</Text>
            </View>
          </View>
          <View className="px-5 space-y-4">
            <View className="space-y-2">
              <Text>Amount To Send</Text>
              <TextInput
                onChangeText={setAmount}
                keyboardType={"number-pad"}
                mode="outlined"
                className="bg-transparent"
                value={amount}
                outlineStyle={{ borderRadius: 15 }}
                placeholder={"Amount"}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Button onPress={() => setAmount("15000")}>ALL</Button>
                    )}
                  />
                }
              />
            </View>
            <View className="space-y-2">
              <Text>Amount To Receive</Text>
              <TextInput
                editable={false}
                value={`${toNumber(amount) - 50 >= 0 ? formatNumber(toNumber(amount) - 50) : formatNumber(0)}`}
                placeholder={`${formatNumber(0)}`}
                className="bg-transparent"
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />
            </View>

            <View className="space-y-2">
              <Text>Share Pin</Text>
              <TextInput
                placeholder={`Enter your pin`}
                mode="outlined"
                className="bg-transparent"
                secureTextEntry={showPassword ? false : true}
                keyboardType="numeric"
                onChangeText={setSharePin}
                outlineStyle={{ borderRadius: 15 }}
                right={
                  <TextInput.Icon
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? "eye-off" : "eye"}
                  />
                }
              />

              <View className="flex-row items-center space-x-0">
                <Text>I dont have share pin</Text>
                <Button
                  onPress={() => handleCreatePin()}
                  labelStyle={{ textDecorationLine: "underline" }}
                  mode="text"
                >
                  Create
                </Button>
              </View>
            </View>

            <View className="pt-5 px-5">
              <Button
                onPress={handleContinue}
                mode="contained"
                className="p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
              >
                Continue
              </Button>
            </View>
          </View>
        </View>
      </View>
      <TransactionPinSheet
        visible={transferSheetVisible}
        onCancel={() => setTransferSheetVisible(false)}
        onComplate={handleConvert}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default transfer;
