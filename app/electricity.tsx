import {
  View,
  Text,
  Pressable,
  Keyboard,
  GestureResponderEvent,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Chip,
  DataTable,
  Icon,
  List,
  Searchbar,
  TextInput,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import { BettingProviders, ElectricityProviders } from "@/constants/DemoList";
import { showMessage } from "react-native-flash-message";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { formatNumber, toNumber } from "@/constants/Formats";
import { Timer } from "@/constants/Utils";
import { StatusBar } from "expo-status-bar";

const electricity = () => {
  const [selectedMeterType, setSelectedMeterType] = useState("postpaid");
  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);
  const [providerSelectSheetVisible, setProviderSelectSheetVisible] =
    useState(false);

  const [verifyingID, setVerifyingID] = useState(false);

  const [idVerified, setIdVerified] = useState(false);

  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [previewSheetVisible, setPreviewSheetVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<(typeof ElectricityProviders)[0]>();
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleNext = async (e: GestureResponderEvent) => {
    if (!selectedProvider) {
      showMessage({
        message: "Please Select Provider",
        type: "danger",
        icon: "danger",
      });

      return;
    }
    if (!meterNumber) {
      showMessage({
        message: "Please Enter Meter Number",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (!amount) {
      showMessage({
        message: "Please Enter Amount",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (meterNumber && !idVerified) {
      await handleVerifyID();
      setPreviewSheetVisible(true);
    } else {
      setPreviewSheetVisible(true);
    }
  };

  const handleProviderSelect = (name: (typeof ElectricityProviders)[0]) => {
    setSelectedProvider(name);
    setProviderSelectSheetVisible(false);
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
          message: `You have successfuly send ${amount} to id ${meterNumber}`,
        }),
      },
    });
  };

  const onConfirm = () => {
    setPreviewSheetVisible(false);
    setTransactionPinSheetVisible(true);
  };

  const handleVerifyID = async () => {
    if (!meterNumber) {
      showMessage({
        message: "Please Enter Meter Number",
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

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <View>
        <Appbar collapsable={true}>
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

          <Appbar.Content title="Electricity" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
        <View>
          <View className="px-5 space-y-3">
            <View className="space-y-2 mt-4">
              <Text className="text-[15px] ml-2">Biller</Text>
              <Pressable onPress={() => setProviderSelectSheetVisible(true)}>
                <TextInput
                  mode="outlined"
                  editable={false}
                  className="rounded-lg"
                  placeholder="Select Provider"
                  outlineStyle={{ borderRadius: 15 }}
                  
                  value={selectedProvider ? selectedProvider.name : ""}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          resizeMode="contain"
                          className="h-10 w-10 rounded-full"
                          source={{
                            uri: selectedProvider ? selectedProvider.icon : "",
                          }}
                        />
                      )}
                    />
                  }
                  right={
                    <TextInput.Icon
                      onPress={() => setProviderSelectSheetVisible(true)}
                      size={24}
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
            <View className="flex-row items-center space-x-2">
              <Chip
                onPress={() => setSelectedMeterType("postpaid")}
                selected={selectedMeterType == "postpaid"}
              >
                PostPaid
              </Chip>
              <Chip
                onPress={() => setSelectedMeterType("prepaid")}
                selected={selectedMeterType == "prepaid"}
              >
                PrePaid
              </Chip>
            </View>
            <View className="space-y-2">
              <Text>Meter Number</Text>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                keyboardType="numeric"
                placeholder="Enter Meter Numer"
                onChangeText={setMeterNumber}
                outlineStyle={{ borderRadius: 15 }}
              />
              <View className="flex-row items-center justify-between">
                <View>
                  {idVerified && (
                    <View className="items-center flex-row space-x-1">
                      <Icon source={"check-circle"} color="green" size={20} />
                      <Text>{meterNumber}</Text>
                    </View>
                  )}
                </View>
                <View className="self-end">
                  {!verifyingID && (
                    <Button onPress={handleVerifyID} mode="contained-tonal">
                      Verify ID
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

            <View className="space-y-2">
              <Text>Amount</Text>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                keyboardType="numeric"
                onChangeText={setAmount}
                placeholder="Enter Meter Amount"
                outlineStyle={{ borderRadius: 15 }}
              />
            </View>

            <View className="px-5 pt-5">
              <Button
                onPress={handleNext}
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
      </View>

      <BottomSheet
        visible={providerSelectSheetVisible}
        onDismiss={setProviderSelectSheetVisible}
        mode={"full-width"}
        height={"70%"}
      >
        <View className="h-full">
          <View className="p-3 px-5 space-y-5">
            <Text className="text-[17px] font-bold text-center">
              Select Provider
            </Text>
            <Searchbar value="" placeholder="Search Provider..." />
          </View>
         
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => `${item.name}`}
              initialNumToRender={12}
              data={ElectricityProviders}
              
              renderItem={({ item }) => (
                <View className="mt-2 px-5">
                  <List.Item
                    onPress={() => handleProviderSelect(item)}
                    title={item.name}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <Image
                            resizeMode="contain"
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
      </BottomSheet>

      <TransactionPinSheet
        visible={transactionPinSheetVisible}
        onCancel={() => setTransactionPinSheetVisible(false)}
        onComplate={handlePinComplate}
        processingTransaction={transactionProcessing}
      />

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
                <Text className="font-bold">Provider</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{selectedProvider?.name}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Meter Type</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {selectedMeterType.toLocaleLowerCase()}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {formatNumber(toNumber(amount))}
              </DataTable.Cell>
            </DataTable.Row>
          </View>
          <View className="absolute bottom-10 w-full mb-5 px-5 mt-5">
            <Button onPress={onConfirm} mode="contained">
              Confirm
            </Button>
          </View>
        </View>
      </BottomSheet>
      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default electricity;
