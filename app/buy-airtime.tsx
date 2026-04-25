import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Appbar,
  Button,
  HelperText,
  Icon,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { PaperSafeView } from "@/components/PaperView";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectNetworkComponent from "@/components/Selection/SelectNetworkComponent";
import { Keyboard } from "react-native";
import { isValidMobileNumber, Timer, toNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import { formatNumber } from "@/constants/Formats";
import BottomSheet from "@/components/models/BottomSheet";
import BuyAirtimePreviewContainer from "@/components/Containers/BuyAirtimePreviewContainer";
import { NetworksType } from "@/constants/Types";
import { Networks } from "@/constants/DemoList";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import { Toast } from "@/constants/Toast";

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
    await new Timer().postDelayedAsync({ sec: 300 });
    setClied(false);
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
          className="h-[70px] px-3 w-[100px] rounded-lg items-center justify-center"
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
    <View className="w-screen">
      <FlatList
        data={SuggestAmounts}
        numColumns={3}
        renderItem={({ item }) => (
          <BuyAirtimeSuggestAmountCard
            onPress={onSelect}
            amount={item.amount}
            cashback={item.cashback}
            key={item.id}
          />
        )}
      />
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
  const [netWorkErrorVisible, setNetWorkErrorVisible] = useState(false)
  const theme = useTheme();
  const [buyAirtimePreviewVisible, setbuyAirtimePreviewVisible] =
    useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworksType[0]>();
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (isValidMobileNumber(mobileNumber)) {
      Keyboard.dismiss();
    }
  }, [mobileNumber]);

  const handleBuy = () => {
    if (!selectedNetwork) {
      showMessage({
        message: "Please Select Network",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (!isValidMobileNumber(mobileNumber)) {
      showMessage({
        message: "Invalid Number",
        description: "Please Enter Valid Mobile Number",
        icon: "danger",
        type: "danger",
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
      url: "/buy-airtime/", data: {
        amount: toNumber(amount),
        network_id: selectedNetwork?.id,
        number: mobileNumber
    } });

    setTransactionProcessing(false);
    setPinSheetVisible(false);

    if (response.status == 1) {
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          status: "Success",
          type: "Airtime",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
      return;
    }

    if (response.status == 0) {
      Toast.danger({title: "Transaction Failed", body: response.message})
      return;
    }

    if (response.status == undefined) {
      setNetWorkErrorVisible(true)
      return;
    }
  };
  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()} className="flex-1 ">
      <Appbar className="bg-transparent">
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
      </Appbar>
      <View className="flex-1 space-y-0 mt-5">
        <View>
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
            className="bg-transparent"
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
        visible={buyAirtimePreviewVisible}
        height={"50%"}
        onDismiss={setbuyAirtimePreviewVisible}
      >
        <View>
          <BuyAirtimePreviewContainer
            networkData={selectedNetwork}
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
          <View className="h-full w-full items-center justify-center">
            <Text>No Data</Text>
          </View>
        </View>
      </BottomSheet>
      <NetworkRequestErrorSheet visible={netWorkErrorVisible} onDismiss={setNetWorkErrorVisible}/>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default buyairtime;
