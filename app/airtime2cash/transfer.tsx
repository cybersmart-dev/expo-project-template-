import {
  View,
  Keyboard,
  Platform,
  Linking,
  Pressable,
  BackHandler,
  Image
} from "react-native";
import React, { useCallback, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  Button,
  TextInput,
  useTheme,
  Text,
  ActivityIndicator,
  IconButton,
  Icon,
  Divider,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { formatNumber } from "@/constants/Formats";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { toNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import * as IntentLauncher from "expo-intent-launcher";
import {  } from "expo-image";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";
import BottomSheet from "@/components/models/BottomSheet";
import { Networks } from "@/constants/DemoList";
import { Storage } from "@/constants/Storage";
import { EaseView } from "react-native-ease";

const transfer = () => {
  const { number, token, network_id } = useLocalSearchParams();
  const theme = useTheme();
  const [transferSheetVisible, setTransferSheetVisible] = useState(false);
  const [amount, setAmount] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [sharePin, setSharePin] = useState("");
  const [hideBalance, setHideBalance] = useState(false);
  const [showPinSheet, setShowPinSheet] = useState(false);

  const [airtimeBalance, setAirtimeBalance] = useState(0);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [networks, setNetworks] = useState<Array<(typeof Networks[0])>>([]);
  const [fetchBalaceFailed, setFetchBalaceFailed] = useState(false);
  const [networkRequestFailed, setNetworkRequestFailed] = useState(false);
  const [showBackBottomSheet, setShowBackBottomSheet] = useState(false);
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [networkData, setNetworkData] = useState({})

  useFocusEffect(
    useCallback( () => {
     loadData()
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        setShowBackBottomSheet(true);
        return true;
      });
      return () => back.remove();
    }, []),
  );

  const loadData = async () => {
      fetchBalance();
      getNetworkData()
  }

  const getNetworkData = async () => {
    const networks = await loadNetworks()
    const network: any = networks.find((network:any ) => network?.id === 1)
    setNetworkData(network)
  }

  const handleContinue = () => {
    if (toNumber(amount) < 100) {
      showMessage({
        message: "Minimum Amount is 100",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!sharePin || sharePin.length <= 3) {
      showMessage({
        message: "Please Enter Your Valid Share Pin",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    setTransferSheetVisible(true);
  };

  const fetchBalance = async () => {
    setFetchingBalance(true);
    setNetworkRequestFailed(false);
    const response = await requests.post({ url: "/sell-airtime/balance/" });
    setFetchingBalance(false);

    if (response.status == 1) {
      setAirtimeBalance(response.data?.balance);
    }
    if (response.status == 0) {
      Toast.danger({
        title: "Faield to fetch balabce",
        body: response?.message,
      });
    }

    if (response.status == undefined) {
      setNetworkRequestFailed(true);
      Toast.danger({
        title: "failed to fetch balanec",
        body: response?.message,
      });
    }
  };

  const handleConvert = async (pin: string) => {
    setProcessingTransfer(true);
    const response = await requests.post({
      url: "/sell-airtime/verify/",
      data: {
        network_id: network_id,
        number: number,
        req_type: "transfer",
        amount: amount,
        pin: pin,
        share_pin: sharePin
      },
    });

    setProcessingTransfer(false);
    setTransferSheetVisible(false);

    console.log(response)

    if (response.status == 0) {
      Toast.danger({title:"Transaction failed", body: response.message})
    }

    if (response.status == 1) {

      Toast.success({title: "Successful", body: response.message})
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          status: "Success",
          type: "Deposit",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
    }

    if (response.status == undefined) {
       Toast.danger({title:"Transaction failed", body: response.message})
    }

    
  };

   const loadNetworks = async () => {
      try {
        const networksString = await Storage.secureGet("networks");
        if (networksString) {
          const networks = JSON.parse(networksString)
          setNetworks(networks);
          return networks
        }
      } catch (error) {}
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

  const getAmountWithFee = () => {
    let fee = toNumber(amount) * 0.2;
    return toNumber(amount) - fee;
  };

  const getReceveAmount = () => {
    return toNumber(getAmountWithFee()) >= 0
      ? formatNumber(getAmountWithFee())
      : formatNumber(0);
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
            <View
              style={{
                backgroundColor: theme.dark
                  ? theme.colors.primary
                  : theme.colors.primaryContainer,
              }}
              className="items-center space-y-2 rounded-lg flex-row p-5 justify-around"
            >
              <View>
                <View className="flex-row items-center space-x-2 mb-2">
                  <Text className="font-bold text-[11px] text-black ">
                    Airtime Balance
                  </Text>
                  <Pressable onPress={() => setHideBalance(!hideBalance)}>
                    <Icon
                      color="black"
                      size={20}
                      source={hideBalance ? "eye" : "eye-off"}
                    />
                  </Pressable>
                  <Pressable onPress={fetchBalance}>
                    <EaseView animate={{rotate: fetchingBalance ? 0 : 360}} transition={{duration: 500, type:"timing"}}>
                      <Icon color="black" size={20} source={"sync"} />
                    </EaseView>
                  </Pressable>
                </View>
                {fetchingBalance ? (
                  <View className="space-y-2">
                    <ActivityIndicator color={"black"} />
                    <Text className="text-[10px] text-center text-black">
                      Loading balance...
                    </Text>
                  </View>
                ) : networkRequestFailed ? (
                  <View>
                    <Button
                      onPress={fetchBalance}
                      mode={"contained-tonal"}
                      icon={"sync"}
                    >
                      Reload
                    </Button>
                  </View>
                ) : (
                  <Text className="text-3xl text-black">
                    ₦{hideBalance ? "*****" : formatNumber(airtimeBalance)}
                  </Text>
                )}
              </View>

              <View className="items-center justify-center">
                <View className="w-full flex-row items-center justify-center space-x-2">
                  <Text className="text-lg font-bold text-black">{new String(networkData?.name)?.toUpperCase()}</Text>
                  <Image className="h-6 w-6 rounded-full" source={{uri: networkData?.icon}} />
                </View>
                <Text className="text-black">{number}</Text>
              </View>
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
                      <Button onPress={() => setAmount(`${airtimeBalance}`)}>
                        ALL
                      </Button>
                    )}
                  />
                }
              />
            </View>
            <View className="space-y-2">
              <Text>Amount To Receive</Text>
              <TextInput
                editable={false}
                value={`${getReceveAmount()}`}
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
        processingTransaction={processingTransfer}
        onCancel={() => setTransferSheetVisible(false)}
        onComplate={handleConvert}
      />

      <BottomSheet visible={showBackBottomSheet} height={"auto"}>
        <View className="p-2 px-3">
          <Text className="font-bold text-lg">GO BACK</Text>
          <Divider />
          <Text className="mt-2">Are you sure do you want go back</Text>

          <View className="gap-2 mt-5 flex-row w-full">
            <Button
              onPress={() => router.back()}
              className="text-lg p-0"
              buttonColor="red"
              textColor="white"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode={"contained-tonal"}
            >
              Yes
            </Button>
            <Button
              onPress={() => setShowBackBottomSheet(false)}
              className="text-lg p-0 flex-1"
              buttonColor="lightgreen"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode={"contained-tonal"}
            >
              No
            </Button>
          </View>
        </View>
      </BottomSheet>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default transfer;
