import { Keyboard, Pressable, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  Button,
  Chip,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectNetworkComponent from "@/components/Selection/SelectNetworkComponent";
import DataListContainer from "@/components/Containers/DataListContainer";
import { StatusBar } from "expo-status-bar";
import { DataPackType, NetworksType } from "@/constants/Types";
import BottomSheet from "@/components/models/BottomSheet";
import BuyDataPreviewComponent from "@/components/Containers/BuyDataPreviewComponent";
import { Networks } from "@/constants/DemoList";
import { isValidMobileNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";

const buydata = () => {
  const theme = useTheme();
  const [selectedNetworkName, setSelectedNetworkName] = useState<
    "mtn" | "airtel" | "glo" | "9mobile"
  >("mtn");
  const [selectedBundlePacks, setSelectedBundlePacks] = useState<DataPackType>();
  const [selectedNetworkData, setselectedNetworkData] = useState<
    NetworksType[0]
  >(Networks[0]);
  const [beneficiarySheetVisible, setBeneficiarySheetVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinSheetVisible, setPinSheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const timerRef = useRef(0);

  const [buyDataPreviewVisible, setBuyDataPreviewVisible] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (isValidMobileNumber(mobileNumber)) {
      Keyboard.dismiss();
    }
  }, [mobileNumber]);

  const handleBuy = () => {
    if (!isValidMobileNumber(mobileNumber)) {
      showMessage({
        message: "Please Enter valid mobile number",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!selectedBundlePacks) {
      showMessage({
        message: "Please select plan",
        type: "danger",
        icon: "danger",
      });
      return
    }

    setBuyDataPreviewVisible(true);
  };

  const handleConfirm = () => {
    setBuyDataPreviewVisible(false);
    setPinSheetVisible(true);
  };

  const handleBuyData = (pin: string) => {
    const amount = selectedBundlePacks?.price;
    setTransactionProcessing(true);

    timerRef.current = setTimeout(() => {
      setTransactionProcessing(false);
      setPinSheetVisible(false);
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          status: "Success",
          type: "Data",
          amount: amount,
          data: JSON.stringify({
            statusCode: 1,
            type: "data",
            phone: mobileNumber,
            id: 1,
            charge: 0.0,
            cashback: 0.4,
            message: `You have successfuly buy ${selectedNetworkName.toUpperCase()} ${selectedBundlePacks?.benefits} of data to ${mobileNumber}`,
          }),
        },
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, 2000);
  };
  return (
    <PaperSafeView className="flex-1">
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

          <Appbar.Content title="Buy Data" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
      </View>

      <View className="flex-1">
        <View className="mt-2">
          <Pressable
            onPress={() => setBeneficiarySheetVisible(true)}
            className="px-5 right-[-63%] items-center mb-2 flex-row "
          >
            <Text className="font-bold">Beneficiary</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={theme.colors.onBackground}
            />
          </Pressable>
          <SelectNetworkComponent
            onChangeText={setMobileNumber}
            onSelectNetwork={(data) => {
              setSelectedNetworkName(data.name);
              setselectedNetworkData(data);
              setSelectedBundlePacks(undefined)
            }}
          />
        </View>

        <View>
          <DataListContainer
            network={selectedNetworkName}
            onPackSelect={setSelectedBundlePacks}
          />

          <View className="px-5">
            <View
              style={{ backgroundColor: theme.colors.primaryContainer }}
              className=" rounded-lg h-auto py-2 mt-3"
            >
              <View className=" items-center flex-row justify-between px-3">
                <Text className="">Save Beneficiary</Text>
                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5">
          <Button
            onPress={handleBuy}
            className="text-lg p-1"
            style={{ borderRadius: 15 }}
            labelStyle={{ fontSize: 16 }}
            mode="contained"
          >
            Buy Now
          </Button>
        </View>
      </View>

      <BottomSheet
        mode="center"
        height={"50%"}
        visible={buyDataPreviewVisible}
        onDismiss={setBuyDataPreviewVisible}
      >
        <BuyDataPreviewComponent
          mobileNumber={mobileNumber}
          pack={selectedBundlePacks}
          networkData={selectedNetworkData}
          onConfirm={handleConfirm}
        />
      </BottomSheet>
      <TransactionPinSheet
        processingTransaction={transactionProcessing}
        visible={pinSheetVisible}
        onCancel={() => setPinSheetVisible(false)}
        onComplate={handleBuyData}
      />

      <BottomSheet
        height={"50%"}
        visible={beneficiarySheetVisible}
        onDismiss={setBeneficiarySheetVisible}
        mode={"full-width"}
      >
        <View>
          <View className="p-3">
            <Text className="text-lg">Select Beneficiary</Text>
          </View>
          <View className="h-full w-full items-center justify-center">
            <Text>No Data</Text>
          </View>
        </View>
      </BottomSheet>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default buydata;
