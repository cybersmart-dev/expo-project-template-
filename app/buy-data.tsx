import { Keyboard, Pressable, ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  Button,
  Chip,
  List,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectNetworkComponent from "@/components/Selection/SelectNetworkComponent";
import DataListContainer from "@/components/Containers/DataListContainer";
import { StatusBar } from "expo-status-bar";
import { BeneficiaryType, DataPackType, NetworksType } from "@/constants/Types";
import BottomSheet from "@/components/models/BottomSheet";
import BuyDataPreviewComponent from "@/components/Containers/BuyDataPreviewComponent";
import { Networks } from "@/constants/DemoList";
import { isValidMobileNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import requests from "@/Network/HttpRequest";
import NoConnectionModal from "@/components/models/NoConnectionModal";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import CustomAppbar from "@/components/CustomAppbar";
import { Toast } from "@/constants/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const buydata = () => {
  const theme = useTheme();
  const [selectedNetworkName, setSelectedNetworkName] = useState<
    "mtn" | "airtel" | "glo" | "9mobile"
  >();
  const [selectedBundlePacks, setSelectedBundlePacks] =
    useState<DataPackType>();
  const [selectedNetworkData, setselectedNetworkData] =
    useState<NetworksType[0]>();
  const [beneficiarySheetVisible, setBeneficiarySheetVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinSheetVisible, setPinSheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);

  const [phoneError, setPhoneError] = useState(false);
  const [netWorkErrorVisible, setNetWorkErrorVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworksType[0]>();

  const [buyDataPreviewVisible, setBuyDataPreviewVisible] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Array<BeneficiaryType>>(
    [],
  );

  const [selectNetworkSheetVisible, setSelectNetworkSheetVisible] =
    useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (isValidMobileNumber(mobileNumber)) {
      Keyboard.dismiss();
    }
  }, [mobileNumber]);

  const handleBuy = () => {
    if (!selectedNetworkData) {
      setSelectNetworkSheetVisible(true);
      Toast.danger({ title: "Please Select Network" });
      return;
    }
    if (!isValidMobileNumber(mobileNumber)) {
      setPhoneError(true);
      Toast.danger({ title: "Please Enter valid mobile number" });
      return;
    }
    if (!selectedBundlePacks) {
      Toast.danger({ title: "Please select plan" });
      return;
    }

    setBuyDataPreviewVisible(true);
  };

  const handleConfirm = () => {
    setBuyDataPreviewVisible(false);
    setPinSheetVisible(true);
  };

  useEffect(() => {
    setPhoneError(false);
  }, [mobileNumber]);

  const handleBuyData = async (pin: string) => {
    const amount = selectedBundlePacks?.price;
    setTransactionProcessing(true);

    const response = await requests.post({
      url: "/buy-data/",
      data: {
        number: mobileNumber,
        plan_id: selectedBundlePacks?.id,
        network_id: selectedNetworkData?.id,
        pin: pin,
      },
    });

    setTransactionProcessing(false);

    if (response.status == 0) {
      setPinSheetVisible(false);
      showMessage({
        message: "Transaction Failed",
        description: response.message,
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (response.status == undefined) {
      setPinSheetVisible(false);
      setNetWorkErrorVisible(true);
      return;
    }

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
          status: "Success",
          type: "Data",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
    }
  };

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
        "data_beneficiaries",
        JSON.stringify(beneficiaries_copy),
      );
    } catch (error) {}
  };

  const loadBeneficiaries = async () => {
    try {
      const beneficiariesString = await AsyncStorage.getItem(
        "data_beneficiaries",
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
    <PaperSafeView className="flex-1">
      <View>
        <CustomAppbar>
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
        </CustomAppbar>
      </View>

      <ScrollView>
        <View className="flex-1">
          <View className="mt-2">
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
              onChangeText={setMobileNumber}
              error={phoneError}
              selectedNetworkProp={selectedNetwork}
              value={mobileNumber}
              showNetworksSheet={selectNetworkSheetVisible}
              onSelectNetwork={(data) => {
                setSelectedNetworkName(data.name);
                setselectedNetworkData(data);
                setSelectedBundlePacks(undefined);
              }}
            />
          </View>

          <View>
            <DataListContainer
              networkId={selectedNetworkData?.id}
              network={selectedNetworkName}
              onPackSelect={setSelectedBundlePacks}
              onPressSelectNetwork={() => setSelectNetworkSheetVisible(true)}
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
        </View>
      </ScrollView>

      <BottomSheet
        mode="center"
        height={"auto"}
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
      <NoConnectionModal visible={false} />
      <NetworkRequestErrorSheet
        visible={netWorkErrorVisible}
        onDismiss={setNetWorkErrorVisible}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default buydata;
