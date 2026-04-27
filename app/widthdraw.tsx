import {
  View,
  Pressable,
  Image,
  GestureResponderEvent,
  FlatList,
} from "react-native";
import React, { useState } from "react";
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
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { showMessage } from "react-native-flash-message";
import { Timer, toNumber } from "@/constants/Utils";
import BottomSheet from "@/components/models/BottomSheet";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";

const banks = [
  {
    id: 1,
    name: "opay",
    icon: "",
  },
];

const widthdraw = () => {
  const theme = useTheme();
  const [verifyingID, setVerifyingID] = useState(false);
  const [acountNumber, setAcountNumber] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [amount, setAmount] = useState("");
  const [bankSelectSheetVisible, setBankSelectSheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [previewSheetVisible, setPreviewSheetVisible] = useState(false);
  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);

  const [bankSelectError, setBankSelectError] = useState(false);
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const handleVerifyID = async () => {
    if (acountNumber.length < 10) {
      showMessage({
        message: "Please Enter Valid Account Number",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    setVerifyingID(true);

    const finished = await new Timer().postDelayedAsync({ sec: 3000 });
    if (finished) {
      setVerifyingID(false);
      setIdVerified(true);
    }
    return finished;
  };
  function handleShowProviders(event: GestureResponderEvent): void {
    setBankSelectSheetVisible(true);
  }

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
    if (acountNumber.length >= 10 && !idVerified) {
      await handleVerifyID();
      await new Timer().postDelayedAsync({ sec: 500 });
      setPreviewSheetVisible(true);
    } else {
      setPreviewSheetVisible(true);
    }
  };

  const handlePinComplate = async (pin: string) => {
    setTransactionProcessing(true);
    const finished = await new Timer().postDelayedAsync({ sec: 3000 });
    setTransactionPinSheetVisible(false);
    setTransactionProcessing(false);

    router.push({
      pathname: "/modals/transfer_response",
      params: {
        status: "Success",
        type: "Betting",
        amount: amount,
        data: JSON.stringify({
          statusCode: 1,
          type: "betting",
          id: 1,
          charge: 0.0,
          cashback: 0.4,
          message: `You have successfuly send ${amount} to id ${acountNumber}`,
        }),
      },
    });
  };
  return (
    <PaperSafeView>
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

          <Appbar.Content title="Widthdraw" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
        <View className="p-2 space-y-5 mt-5">
          <View className="px-5 space-y-2 ">
            <Text className="text-[130x] font-bold">Bank</Text>
            <Pressable onPress={handleShowProviders}>
              <TextInput
                mode="outlined"
                error={bankSelectError}
                className="rounded-lg bg-transparent"
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        className="h-10 w-10 rounded-full"
                        source={{
                          uri: "",
                        }}
                      />
                    )}
                  />
                }
                value={selectedBank}
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

          <View className="px-5 space-y-2 ">
            <Text className="text-[130x] font-bold">Account Number</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                className="rounded-lg bg-transparent"
                error={accountNumberError}
                keyboardType="numeric"
                editable={!idVerified}
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
              <View>
                {idVerified && (
                  <View className="items-center flex-row space-x-1">
                    <Icon source={"check-circle"} color="green" size={20} />
                    <Text>{"Mustapha Aminu"}</Text>
                  </View>
                )}
              </View>
              <View className="self-end">
                {!verifyingID && (
                  <Button onPress={handleVerifyID} mode="contained-tonal">
                    Validate ID
                  </Button>
                )}
                {verifyingID && (
                  <Button
                    disabled
                    onPress={handleVerifyID}
                    mode="contained-tonal"
                  >
                    <ActivityIndicator />
                  </Button>
                )}
              </View>
            </View>
          </View>

          <View className="px-5 space-y-2 ">
            <Text className="text-[130x] font-bold">Amount</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                error={amountError}
                className="rounded-lg bg-transparent"
                keyboardType="numeric"
                placeholder="Amount"
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
              className="text-lg p-1"
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
          <View className="p-3 px-5 space-y-5">
            <Text className="text-[17px] font-bold text-center">
              Select Bank
            </Text>
            <Searchbar value="" placeholder="Search Bank" />
          </View>
          <View className="px-6">
            <FlatList
              keyExtractor={(item) => `${item.id}`}
              data={banks}
              renderItem={({ item }) => (
                <View className="mt-2">
                  <List.Item
                    onPress={() => {
                      setSelectedBank(item.name);
                      setBankSelectSheetVisible(false);
                    }}
                    title={item.name}
                    titleStyle={{ fontWeight: "bold" }}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <Image
                            className="h-10 w-10 rounded-full"
                            source={{ uri: item.icon }}
                          />
                        )}
                      />
                    )}
                  />
                </View>
              )}
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
              <DataTable.Cell numeric>{selectedBank}</DataTable.Cell>
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
              <DataTable.Cell numeric>{"Mustapha Aminu"}</DataTable.Cell>
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
              disabled={!idVerified}
              onPress={async () => {
                setPreviewSheetVisible(false)
                await new Timer().postDelayedAsync({sec: 1000})
                setTransactionPinSheetVisible(true)
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
