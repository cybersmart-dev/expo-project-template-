import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Appbar,
  Button,
  HelperText,
  Icon,
  List,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { PaperSafeView } from "@/components/PaperView";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectNetworkComponent from "@/components/Selection/SelectNetworkComponent";
import { Keyboard } from "react-native";
import { isValidMobileNumber, Timer, toNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { formatNumber } from "@/constants/Formats";
import BottomSheet from "@/components/models/BottomSheet";
import BuyAirtimePreviewContainer from "@/components/Containers/BuyAirtimePreviewContainer";
import { BeneficiaryType, NetworksType } from "@/constants/Types";
import { Networks } from "@/constants/DemoList";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import { Toast } from "@/constants/Toast";
import * as Haptics from "expo-haptics";
import CustomAppbar from "@/components/CustomAppbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const SuggestAmounts = [
  {
    id: 0,
    amount: 50.0,
    cashback: 0.4,
  },
  {
    id: 1,
    amount: 100.0,
    cashback: 0.4,
  },
  {
    id: 2,
    amount: 200.0,
    cashback: 0.4,
  },
  {
    id: 3,
    amount: 500.0,
    cashback: 0.4,
  },
  {
    id: 4,
    amount: 1000.0,
    cashback: 0.4,
  },
  {
    id: 5,
    amount: 2000.0,
    cashback: 0.4,
  },
];

interface BuyAirtimeSuggestAmountCardProps {
  amount: number;
  cashback: number;
  onPress: (amount: number) => void;
}
const BuyAirtimeSuggestAmountCard = ({
  amount,
  cashback,
  onPress,
}: BuyAirtimeSuggestAmountCardProps) => {
  const theme = useTheme();
  const [clied, setClied] = useState(false);

  const handlePress = async (amount: number) => {
    onPress(amount);
    setClied(true);
    await new Timer().postDelayedAsync({ sec: 200 });
    setClied(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  return (
    <View className="p-1">
      <EaseView
        animate={{ scale: clied ? 0.5 : 1 }}
        transition={{ type: "timing", duration: 700 }}
      >
        <TouchableOpacity
          onPress={() => handlePress(amount)}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            boxShadow: "0 3px 2px 2px rgba(0, 0, 0, 0.10)",
          }}
          className="h-[50px] px-3 w-[100px] rounded-lg items-center justify-center"
        >
          <Text numberOfLines={1} className="text-[15px] font-bold">
            ₦ {formatNumber(amount)}
          </Text>
          <Text numberOfLines={1} className="text-[10px] hidden mt-2">
            CashBack{" "}
            <Text className="text-green-700">+ ₦ {formatNumber(cashback)}</Text>
          </Text>
        </TouchableOpacity>
      </EaseView>
    </View>
  );
};
const BuyAirtimeSuggestAmountContainer = ({
  onSelect = (amount: number) => {},
}) => {
  return (
    <View className="w-screen flex-row flex-wrap gap-1">
      {SuggestAmounts.map((item) => (
        <BuyAirtimeSuggestAmountCard
          key={item.id}
          onPress={onSelect}
          amount={item.amount}
          cashback={item.cashback}
        />
      ))}
    </View>
  );
};

const buyairtime = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [amountErrorVisible, setAmountErrorVisible] = useState(false);
  const [pinSheetVisible, setPinSheetVisible] = useState(false);
  const [beneficiarySheetVisible, setBeneficiarySheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [netWorkErrorVisible, setNetWorkErrorVisible] = useState(false);
  const theme = useTheme();
  const [buyAirtimePreviewVisible, setbuyAirtimePreviewVisible] =
    useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworksType[0]>();
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const [numberError, setNumberError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [cashbashEneble, setCashbashEneble] = useState(false)
  const [beneficiaries, setBeneficiaries] = useState<Array<BeneficiaryType>>(
    [],
  );

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (isValidMobileNumber(mobileNumber)) {
      Keyboard.dismiss();
    }
  }, [mobileNumber]);

  const handleBuy = async () => {
    if (!selectedNetwork) {
      setNetworkError(true);
      Toast.danger({ title: "Please Select Network" });
      return;
    }

    if (!isValidMobileNumber(mobileNumber)) {
      setNumberError(true);
      Toast.danger({
        title: "Invalid Number",
        body: "Please Enter Valid Mobile Number",
      });
      return;
    }
    if (!amount || toNumber(amount) < 50) {
      setAmountErrorVisible(true);
      return;
    }

    setbuyAirtimePreviewVisible(true);
    setAmountErrorVisible(false);
  };

  const handleConfirm = () => {
    setbuyAirtimePreviewVisible(false);
    setPinSheetVisible(true);
  };

  const handleBuyAirtime = async (pin: string) => {
    setTransactionProcessing(true);

    const response = await requests.post({
      url: "/buy-airtime/",
      data: {
        amount: toNumber(amount),
        network_id: selectedNetwork?.id,
        number: mobileNumber,
        pin: pin,
        use_cashback: cashbashEneble
      },
    });

    setTransactionProcessing(false);
    setPinSheetVisible(false);

    if (response.status == 1) {
      if (isSwitchOn) {
        const beneficiary: BeneficiaryType = {
          phone_number: mobileNumber,
          network: selectedNetwork,
        };
        saveBeneficiary(beneficiary);
      }
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          type: "Airtime",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
      return;
    }

    if (response.status == 0) {
      Toast.danger({ title: "Transaction Failed", body: response.message });
      return;
    }

    if (response.status == undefined) {
      setNetWorkErrorVisible(true);
      return;
    }
  };

  useEffect(() => {
    setNumberError(false);
  }, [mobileNumber]);

  useFocusEffect(
    useCallback(() => {
      loadBeneficiaries();
    }, []),
  );

  const saveBeneficiary = async (beneficiary: BeneficiaryType) => {
    try {
      let is_exists =
        beneficiaries.find(
          (mBeneficiary) =>
            mBeneficiary.phone_number == beneficiary.phone_number,
        ) != undefined;
      if (is_exists) {
        return;
      }
      const beneficiaries_copy: Array<BeneficiaryType> = JSON.parse(
        JSON.stringify(beneficiaries),
      );
      beneficiaries_copy.push(beneficiary);

      await AsyncStorage.setItem(
        "airtime_beneficiaries",
        JSON.stringify(beneficiaries_copy),
      );
    } catch (error) {}
  };

  const loadBeneficiaries = async () => {
    try {
      const beneficiariesString = await AsyncStorage.getItem(
        "airtime_beneficiaries",
      );
      if (!beneficiariesString) {
        return;
      }

      const beneficiariesData = JSON.parse(beneficiariesString);

      console.log("beneficiaries: ", beneficiariesData);

      setBeneficiaries(beneficiariesData);
    } catch (error) {}
  };

  const handleBeneficiarySelect = useCallback(
    (beneficiary: BeneficiaryType) => {
      setBeneficiarySheetVisible(false);
      setMobileNumber(beneficiary.phone_number);
      setSelectedNetwork(beneficiary.network);
    },
    [],
  );

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()} className="flex-1 ">
      <CustomAppbar>
        <Appbar.Action
          isLeading
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
          onPress={() => router.back()}
        />
        <Appbar.Content title="Buy Airtime" />

        <Appbar.Action
          icon={() => (
            <MaterialIcons
              name="contact-support"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />
      </CustomAppbar>

      <ScrollView className="flex-1 space-y-0 mt-5">
        <View>
          <Pressable
            onPress={() => setBeneficiarySheetVisible(true)}
            className="px-5 right-[-53%] items-center mb-2 flex-row "
          >
            <Text className="font-bold">All Beneficiaries</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={theme.colors.onBackground}
            />
          </Pressable>
          <SelectNetworkComponent
            error={numberError}
            selectedNetworkProp={selectedNetwork}
            showNetworksSheet={networkError}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            onSelectNetwork={(data) => setSelectedNetwork(data)}
          />
        </View>

        <View className="px-5 pt-5">
          <TextInput
            onChangeText={setAmount}
            value={amount}
            maxLength={10}
            placeholder={"Enter Amount"}
            mode="outlined"
            keyboardType="numeric"
            outlineStyle={{ borderRadius: 15 }}
            style={{ backgroundColor: "transparent" }}
            error={amountErrorVisible}
          />
          <HelperText
            className={"items-center"}
            visible={amountErrorVisible}
            type="error"
          >
            <Icon color="red" source={"information"} size={15} /> {""} Please
            Enter Amount Here
          </HelperText>
        </View>

        <View className="px-5">
          <Text className="mb-1 font-bold">Select Amount</Text>
          <BuyAirtimeSuggestAmountContainer
            onSelect={(amount) => setAmount(`${amount}`)}
          />

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

        <View className="px-5 pt-5">
          <Button
            onPress={handleBuy}
            className="text-lg py-1"
            style={{ borderRadius: 15 }}
            labelStyle={{ fontSize: 16 }}
            mode="contained"
          >
            Buy Now
          </Button>
        </View>

        <View className="px-5 mt-5 gap-y-2 mb-5">
          <Text>Beneficiaries</Text>
          <View
            style={{
              backgroundColor: theme.dark
                ? theme.colors.surfaceVariant
                : "white",
            }}
            className="px-0 rounded-lg mt-0"
          >
            {beneficiaries.map((item) => (
              <View key={item.phone_number} className="px-5">
                <List.Item
                  title={item.phone_number}
                  onPress={() => handleBeneficiarySelect(item)}
                  left={() => (
                    <List.Icon
                      icon={() => (
                        <Image
                          className="rounded-full h-[30px] w-[30px]"
                          source={{ uri: item.network?.icon }}
                        />
                      )}
                    />
                  )}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        visible={buyAirtimePreviewVisible}
        height={"auto"}
        onDismiss={setbuyAirtimePreviewVisible}
      >
        <View>
          <BuyAirtimePreviewContainer
            networkData={selectedNetwork}
            onCashBack={setCashbashEneble}
            amount={toNumber(amount)}
            onConfirm={handleConfirm}
            mobileNumber={mobileNumber}
          />
        </View>
      </BottomSheet>
      <TransactionPinSheet
        onComplate={handleBuyAirtime}
        onCancel={() => setPinSheetVisible(false)}
        visible={pinSheetVisible}
        processingTransaction={transactionProcessing}
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
          <View className="h-full w-full">
            {beneficiaries.map((item) => (
              <View key={item.phone_number} className="px-5">
                <List.Item
                  title={item.phone_number}
                  onPress={() => handleBeneficiarySelect(item)}
                  left={() => (
                    <List.Icon
                      icon={() => (
                        <Image
                          className="rounded-full h-[30px] w-[30px]"
                          source={{ uri: item.network?.icon }}
                        />
                      )}
                    />
                  )}
                />
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>
      <NetworkRequestErrorSheet
        visible={netWorkErrorVisible}
        onDismiss={setNetWorkErrorVisible}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default buyairtime;
