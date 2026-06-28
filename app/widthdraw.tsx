import {
  View,
  Pressable,
  Image,
  GestureResponderEvent,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Appbar,
  Button,
  DataTable,
  Icon,
  List,
  Searchbar,
  TextInput,
  useTheme,
  Text,
  HelperText,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { showMessage } from "react-native-flash-message";
import { Timer, toNumber } from "@/constants/Utils";
import BottomSheet from "@/components/models/BottomSheet";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import CustomAppbar from "@/components/CustomAppbar";
import requests from "@/Network/HttpRequest";
import { ResponseStatusCode } from "@/constants/StatusCodes";
import { Toast } from "@/constants/Toast";

const banks = [
  {
    id: 1,
    name: "opay",
    icon: "",
  },
];

type BanksType = Array<{
  bank_name: string;
  bank_code: number;
  slug: string;
  logo: string;
}>;

const widthdraw = () => {
  const theme = useTheme();
  const [verifyingID, setVerifyingID] = useState(false);
  const [acountNumber, setAcountNumber] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BanksType[0]>();
  const [amount, setAmount] = useState("");
  const [bankSelectSheetVisible, setBankSelectSheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [previewSheetVisible, setPreviewSheetVisible] = useState(false);
  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);

  const [bankSelectError, setBankSelectError] = useState(false);
  const [banks, setBanks] = useState<BanksType>([]);
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [accountNumberErrorMessage, setAccountNumberErrorMessage] =
    useState<any>("");
  const [amountError, setAmountError] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [banksLoadFailed, setBanksLoadFailed] = useState(false);
  const [usersearchInputText, setUsersearchInputText] = useState("");
  const [banksLoadFailedErrorMessage, setBanksLoadFailedErrorMessage] =
    useState<any>("");

  const [accountData, setAccountData] = useState<{ AccountName: string }>();
  const [searchBanks, setSearchBanks] = useState<BanksType>([]);

  const handleVerifyID = async (bank_code: number) => {
    setAccountNumberError(false);
    setAccountNumberErrorMessage("");
    if (acountNumber.length < 10) {
      showMessage({
        message: "Please Enter Valid Account Number",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    setVerifyingID(true);

    const response = await requests.post({
      url: "/verify/bank/",
      data: {
        accountNumber: acountNumber,
        bank: bank_code,
      },
    });

    setVerifyingID(false);

    if (response.status == ResponseStatusCode.SUCCESS) {
      setAccountData(response.data);
      setIdVerified(true);
    }

    if (response.status == ResponseStatusCode.FAILED) {
      setAccountNumberError(true);
      setAccountNumberErrorMessage(response?.message);
      await Toast.dangerHapticsAsync({ title: response.message });
    }

    if (response.status == undefined) {
      await Toast.dangerHapticsAsync({ title: response.message });
    }
  };
  function handleShowProviders(event: GestureResponderEvent): void {
    setBankSelectSheetVisible(true);
  }

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    setLoadingBanks(true);

    const response = await requests.get({ url: "/banks/" });
    setLoadingBanks(false);

    if (response.status == ResponseStatusCode.SUCCESS) {
      setBanksLoadFailed(false);
      setSearchBanks(response.data);
      setBanks(response.data);
    }
    if (response.status == ResponseStatusCode.FAILED) {
      setBanksLoadFailed(true);
      setBanksLoadFailedErrorMessage(response?.message);
      await Toast.dangerHapticsAsync({ title: response.message });
    }
    if (response.status == undefined) {
      setBanksLoadFailed(true);
      setBanksLoadFailedErrorMessage(response?.message);
      await Toast.dangerHapticsAsync({ title: response.message });
    }
  };

  const handleNext = async () => {
    if (!selectedBank) {
      showMessage({
        message: "Please Select Bank",
        type: "danger",
        icon: "danger",
      });
      setBankSelectError(true);
      return;
    }
    if (acountNumber.length < 10) {
      showMessage({
        message: "Please Enter Valid Account Number",
        type: "danger",
        icon: "danger",
      });
      setAccountNumberError(true);
      setBankSelectError(false);
      return;
    }
    if (toNumber(amount) < 50) {
      showMessage({
        message: "Enter valid Amount",
        type: "danger",
        icon: "danger",
      });
      setAmountError(true);
      setAccountNumberError(false);
      setBankSelectError(false);
      return;
    }
    setAmountError(false);
    setAccountNumberError(false);
    setBankSelectError(false);

    setPreviewSheetVisible(true);

    if (acountNumber.length >= 10 && !idVerified) {
      await handleVerifyID(selectedBank?.bank_code);
      if (idVerified) {
        setPreviewSheetVisible(true);
      }
    } else {
      setPreviewSheetVisible(true);
    }
  };

  useEffect(() => {
    setIdVerified(false);

    const check = async () => {
      if (acountNumber.length >= 10) {
        if (!selectedBank?.bank_name) {
          setBankSelectSheetVisible(true);
        } else {
          await handleVerifyID(selectedBank?.bank_code);
        }
      }
    };

    check();
  }, [acountNumber]);

  useEffect(() => {
    const handleSearch = () => {
      if (usersearchInputText.trim() != "") {
        handleSearchBank();
        return;
      }
      setSearchBanks(banks);
    };
    handleSearch();
  }, [usersearchInputText]);

  const handleSearchBank = () => {
    const result: any = [];

    banks?.map((bank) => {
      if (
        bank.bank_name?.toLowerCase().match(usersearchInputText.toLowerCase())
      ) {
        result.push(bank);
      }

      setSearchBanks(result);
    });
  };

  const handlePinComplate = async (pin: string) => {
    setTransactionProcessing(true);
    const response = await requests.post({
      url: "/request/withdraw/",
      data: {
        bank: selectedBank?.bank_code,
        amount: amount,
        accountNumber: acountNumber,
        pin:pin
      },
    });
    setTransactionPinSheetVisible(false);
    setTransactionProcessing(false);

    if (response.status == ResponseStatusCode.SUCCESS) {
      
      console.debug("Response: ", response)
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          status: "Success",
          type: "Withdraw",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
    }

    if (response.status == ResponseStatusCode.FAILED) {
      Toast.dangerHapticsAsync({ title: response.message });
      
    }

    if (response.status == undefined) {
      Toast.dangerHapticsAsync({ title: response.message });
    }
  };

  const handleBankSelect = useCallback(
    async (item: BanksType[0]) => {
      setSelectedBank(item);
      setBankSelectSheetVisible(false);

      console.log(item);

      if (acountNumber.length >= 10) {
        await handleVerifyID(item.bank_code);
      }
    },
    [acountNumber],
  );

  return (
    <PaperSafeView>
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

          <Appbar.Content title="Widthdraw" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </CustomAppbar>
        <View className="p-2 gap-y-5 mt-5">
          <View className="px-5 gap-y-2 ">
            <Text className="text-[130x] font-bold">Bank</Text>
            <Pressable onPress={handleShowProviders}>
              <TextInput
                mode="outlined"
                error={bankSelectError}
                className="rounded-lg bg-transparent"
                style={{ backgroundColor: "transparent" }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        className="h-10 w-10 rounded-full"
                        source={{
                          uri: selectedBank?.logo,
                        }}
                      />
                    )}
                  />
                }
                value={selectedBank?.bank_name}
                placeholder="Select Bank"
                outlineStyle={{ borderRadius: 15 }}
                editable={false}
                right={
                  <TextInput.Icon
                    size={24}
                    onPress={handleShowProviders}
                    icon={({ color, size }) => (
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        color={color}
                        size={size}
                      />
                    )}
                  />
                }
              />
            </Pressable>
          </View>

          <View className="px-5 gap-y-2 ">
            <Text className="text-[130x] font-bold">Account Number</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                style={{ backgroundColor: "transparent" }}
                error={accountNumberError}
                keyboardType="numeric"
                placeholder={"Account Number"}
                onChangeText={setAcountNumber}
                maxLength={10}
                outlineStyle={{ borderRadius: 15 }}
                right={
                  <TextInput.Icon
                    size={24}
                    icon={({ color, size }) => (
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        color={color}
                        size={size}
                      />
                    )}
                  />
                }
              />
            </Pressable>

            <View className="flex-row items-center justify-between">
              {accountNumberError && (
                <HelperText visible={accountNumberError} type={"error"}>
                  {accountNumberErrorMessage}
                </HelperText>
              )}
              <View>
                {idVerified && (
                  <View className="items-center flex-row gap-x-1">
                    <Icon source={"check-circle"} color="green" size={20} />
                    <Text>{accountData?.AccountName}</Text>
                  </View>
                )}
              </View>
              <View className="self-end mr-3">
                {verifyingID && <ActivityIndicator size={15} />}
              </View>
            </View>
          </View>

          <View className="px-5 gap-y-2 ">
            <Text className="text-[130x] font-bold">Amount</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                error={amountError}
                className="rounded-lg bg-transparent"
                keyboardType="numeric"
                placeholder="Amount"
                style={{ backgroundColor: "transparent" }}
                value={amount}
                onChangeText={(text) => setAmount(text)}
                outlineStyle={{ borderRadius: 15 }}
              />
            </Pressable>
          </View>

          <View className="px-5 pt-5">
            <Button
              onPress={handleNext}
              disabled={verifyingID}
              className="text-lg py-1"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode="contained"
            >
              Next
            </Button>
          </View>
        </View>
      </View>

      <BottomSheet
        visible={bankSelectSheetVisible}
        onDismiss={setBankSelectSheetVisible}
        mode={"full-width"}
        height={"70%"}
      >
        <View>
          <View className="p-3 px-5 gap-y-5">
            <Text className="text-[17px] font-bold text-center">
              Select Bank
            </Text>
            <Searchbar
              value={usersearchInputText}
              onChangeText={setUsersearchInputText}
              placeholder="Search Bank"
            />
          </View>
          <View className="px-6">
            <FlatList
              keyExtractor={(item) => `${item.bank_code}!${item.bank_name}`}
              data={searchBanks}
              renderItem={({ item }) => (
                <View className="mt-2">
                  <List.Item
                    onPress={() => handleBankSelect(item)}
                    title={item.bank_name}
                    titleStyle={{ fontWeight: "bold" }}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <Image
                            className="h-10 w-10 rounded-full"
                            source={{ uri: item.logo }}
                          />
                        )}
                      />
                    )}
                  />
                </View>
              )}
              ListEmptyComponent={
                <View>
                  {loadingBanks && (
                    <View className="items-center justify-center flex-1 mt-5">
                      <View className="gap-y-4">
                        <ActivityIndicator />
                        <Text>Loading Banks...</Text>
                      </View>
                    </View>
                  )}

                  {banksLoadFailed && !loadingBanks && (
                    <View className="items-center justify-center flex-1 mt-5">
                      <View className="gap-y-4">
                        <Text>{banksLoadFailedErrorMessage}</Text>
                        <Button onPress={loadBanks} mode={"contained-tonal"}>
                          Reload
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              }
            />
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        height={"50%"}
        visible={previewSheetVisible}
        onDismiss={setPreviewSheetVisible}
      >
        <View>
          <View className="px-4 mt-1">
            <Text className="font-bold text-lg">Preview</Text>
          </View>

          <View className="px-4 h-full pt-4">
            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Bank</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{selectedBank?.bank_name}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Account Number</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{acountNumber}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Account Name</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {accountData?.AccountName}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{amount}</DataTable.Cell>
            </DataTable.Row>
          </View>
          <View className="absolute bottom-10 w-full mb-5 px-5 mt-5">
            <Button
              // disabled={!idVerified}
              onPress={async () => {
                setPreviewSheetVisible(false);
                setTransactionPinSheetVisible(true);
              }}
              mode="contained"
            >
              Confirm
            </Button>
          </View>
        </View>
      </BottomSheet>
      <TransactionPinSheet
        visible={transactionPinSheetVisible}
        onCancel={() => setTransactionPinSheetVisible(false)}
        onComplate={handlePinComplate}
        processingTransaction={transactionProcessing}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default widthdraw;
