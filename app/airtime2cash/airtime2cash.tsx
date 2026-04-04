import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  Button,
  HelperText,
  Icon,
  TextInput,
  useTheme,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import {} from "expo-image";
import { NetworkImages } from "@/constants/Images";
import { isValidMobileNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { StatusBar } from "expo-status-bar";

const airtime2cash = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const theme = useTheme();
  const [phoneErrorVisible, setPhoneErrorVisible] = useState(false);
  const [amountErrorVisible, setAmountErrorVisible] = useState(false);
  const [otpSheetVisible, setOtpSheetVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  const timerRef = useRef(0);

  const [processingRequest, setProcessingRequest] = useState(false);

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network);
  };

  const handleSell = () => {
    if (!selectedNetwork) {
      showMessage({
        message: "Please Select Network",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!isValidMobileNumber(phoneNumber)) {
      setPhoneErrorVisible(true);
      return;
    }

    setPhoneErrorVisible(false);
    setOtpSheetVisible(true);
    sendOtp();
  };

  const sendOtp = () => {
    setProcessingRequest(true);
    timerRef.current = setTimeout(() => {
      setProcessingRequest(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    }, 2000);
  };

  const verifyOtp = (otp: string) => {
    setProcessingRequest(true);
    timerRef.current = setTimeout(() => {
      setProcessingRequest(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }

      setOtpSheetVisible(false);
      router.push({
        pathname: "/airtime2cash/transfer",
        params: { number: phoneNumber, token: "thistoken" },
      });
    }, 2000);
  };

  const handleOtpFinish = (pin: string) => {
    verifyOtp(pin);
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

        <View className="p-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="space-x-5 py-2"
          >
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedNetwork == "mtn"
                    ? theme.colors.secondary
                    : theme.colors.primaryContainer,
              }}
              onPress={() => handleNetworkSelect("mtn")}
              className=" p-3 rounded-lg"
            >
              <Image
                className="h-[55px] w-[55px] rounded-full"
                source={{ uri: NetworkImages.MtnImageLogo }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedNetwork == "airtel"
                    ? theme.colors.secondary
                    : theme.colors.primaryContainer,
              }}
              onPress={() => handleNetworkSelect("airtel")}
              className="bg-blue-300 p-3 rounded-lg"
            >
              <Image
                className="h-[55px] w-[55px] rounded-full"
                source={{ uri: NetworkImages.AirtelImageLogo }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedNetwork == "glo"
                    ? theme.colors.secondary
                    : theme.colors.primaryContainer,
              }}
              onPress={() => handleNetworkSelect("glo")}
              className="bg-blue-300 p-3 rounded-lg"
            >
              <Image
                className="h-[55px] w-[55px] rounded-full"
                source={{ uri: NetworkImages.GloImageLogo }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedNetwork == "9mobile"
                    ? theme.colors.secondary
                    : theme.colors.primaryContainer,
              }}
              onPress={() => handleNetworkSelect("9mobile")}
              className="bg-blue-300 p-3 rounded-lg"
            >
              <Image
                className="h-[55px] w-[55px] rounded-full"
                source={{ uri: NetworkImages["9mobileImageLogo"] }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View className="px-5">
          <Text className="text-lg hidden font-bold">
            {selectedNetwork.toUpperCase()}
          </Text>
          <View>
            <TextInput
              onChangeText={setPhoneNumber}
              placeholder="Sender Phone Number"
              keyboardType="numeric"
              className="bg-transparent"
              error={phoneErrorVisible}
              left={<TextInput.Icon icon={"phone"} />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />
            <HelperText
              className={"items-center"}
              visible={phoneErrorVisible}
              type="error"
            >
              <Icon color="red" source={"information"} size={15} /> {""}
              Please Enter Valid Sender Number Here
            </HelperText>
          </View>

          <View className="pt-5">
            <Button
              onPress={handleSell}
              mode="contained"
              className="p-1"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
            >
              Sell Now
            </Button>
          </View>
        </View>
      </View>
      <TransactionPinSheet
        onComplate={handleOtpFinish}
        onCancel={() => {
          setOtpSheetVisible(false);
        }}
        processingTransaction={processingRequest}
        digits={6}
        isTransactionPinSheet={false}
        sheetMode={"center"}
        visible={otpSheetVisible}
        title="Verify Your Number"
        description={`We have send otp to your phone number ( ${phoneNumber} ) `}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default airtime2cash;
