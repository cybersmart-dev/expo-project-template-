import { useCallback, useRef, useState } from "react";
import {
  View,
  Pressable,
  Keyboard,
  FlatList,
  Image as RNImage,
} from "react-native";
import { PaperSafeView } from "@/components/PaperView";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Appbar,
  Button,
  TextInput,
  useTheme,
  Searchbar,
  List,
  Avatar,
  IconButton,
  ActivityIndicator,
  Icon,
  DataTable,
  Text,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { formatNumber } from "@/constants/Formats";
import { Timer, toNumber } from "@/constants/Utils";
import BottomSheet from "@/components/models/BottomSheet";
import { BettingProviders } from "@/constants/DemoList";
import { showMessage } from "react-native-flash-message";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";
import { Image } from "expo-image";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import CustomAppbar from "@/components/CustomAppbar";
import { Toast } from "@/constants/Toast";

const betting = () => {
  const theme = useTheme();
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<(typeof BettingProviders)[0]>();
  const [verifyingID, setVerifyingID] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [providerSelectSheetVisible, setProviderSelectSheetVisible] =
    useState(false);

  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [bettingProviders, setBettingProviders] = useState<
    typeof BettingProviders
  >([]);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);
  const [previewSheetVisible, setPreviewSheetVisible] = useState(false);
  const [fetchingProcessing, setFetchingProcessing] = useState(false);
  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProviders();
    }, []),
  );

  const handleShowProviders = () => {
    setProviderSelectSheetVisible(true);
  };

  const handleProviderSelect = (name: (typeof BettingProviders)[0]) => {
    setSelectedProvider(name);
    setProviderSelectSheetVisible(false);
  };

  const handleVerifyID = async () => {
    if (customerId.length <= 0) {
      showMessage({
        message: "Please Enter Valid Id",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    setVerifyingID(true);

    const response = await requests.post({
      url: "/service/id/validator/",
      data: {
        service:"BETTING",
        "betting_id": selectedProvider?.name,
        "customer_id": customerId
      },
    });

    console.log(response);
    

    if (response.status == 1) {
      setVerifyingID(false);
      setIdVerified(true);
      return response
    }

    if (response.status == 0) {
      setVerifyingID(false);
      await Toast.dangerHapticsAsync({
        title: "Validation Failed",
        body: response.message,
      });
      return 
    }

    if (response.status == undefined) {
      setVerifyingID(false);
      await Toast.dangerHapticsAsync({
        title: "Validation Failed",
        body: "Network disconnected please try again",
      });
      return 
    }

    return response
  };

  const handleNext = async () => {
    if (!selectedProvider) {
      showMessage({
        message: "Please Select Provider",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (customerId.length <= 0) {
      showMessage({
        message: "Please Enter Valid Id",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (toNumber(amount) < 50) {
      showMessage({
        message: "Enter valid Amount",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (customerId.length >= 0 && !idVerified) {
      await handleVerifyID();
      await new Timer().postDelayedAsync({ sec: 500 });
      if (idVerified) {
         setPreviewSheetVisible(true);
      }
      setPreviewSheetVisible(true);
    } else {
      setPreviewSheetVisible(true);
    }
  };
  const onConfirm = () => {
    setPreviewSheetVisible(false);
    setTransactionPinSheetVisible(true);
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
          message: `You have successfuly send ${amount} to id ${customerId}`,
        }),
      },
    });
  };

  const fetchProviders = async () => {
    setFetchingProcessing(true);
    const response = await requests.get({ url: "/betting-providers/" });

    setFetchingProcessing(false);

    if (response.status == 1) {
      setBettingProviders(response.data);
    }

    if (response.status == undefined) {
      setNetworkErrorSheetVisible(true);
    }
  };
  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <View>
        <CustomAppbar>
          <Appbar.Action
            onPress={() => router.back()}
            icon={() => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={theme.colors.onBackground}
              />
            )}
          />

          <Appbar.Content title="Betting" />
        </CustomAppbar>

        <View className="p-2 gap-y-5 mt-5">
          <View className="px-5 gap-y-2 ">
            <Text className="text-[130x] font-bold">Betting Provider</Text>
            <Pressable onPress={handleShowProviders}>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                style={{ backgroundColor: "transparent" }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <RNImage
                        className="h-10 w-10 rounded-full"
                        source={{
                          uri: selectedProvider
                            ? selectedProvider.image_url
                            : "",
                        }}
                      />
                    )}
                  />
                }
                value={selectedProvider ? selectedProvider.name : ""}
                placeholder="Select Betting Provider"
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
            <Text className="text-[130x] font-bold">Customer ID</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                style={{ backgroundColor: "transparent" }}
                keyboardType="numeric"
                editable={!idVerified}
                placeholder={"Customer ID"}
                onChangeText={setCustomerId}
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
                  <View className="items-center flex-row gap-x-1">
                    <Icon source={"check-circle"} color="green" size={20} />
                    <Text>{customerId}</Text>
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

          <View className="px-5 gap-y-2 ">
            <Text className="text-[130x] font-bold">Amount</Text>
            <Pressable>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                style={{ backgroundColor: "transparent" }}
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
        visible={providerSelectSheetVisible}
        onDismiss={setProviderSelectSheetVisible}
        mode={"full-width"}
        height={"70%"}
      >
        <View>
          <View className="p-3 px-5 gap-y-5">
            <Text className="text-[17px] font-bold text-center">
              Select Betting Company
            </Text>
            <Searchbar value="" placeholder="Search Betting Companies..." />
          </View>
          <View className="px-6">
            <FlatList
              keyExtractor={(item) => `${item.id}`}
              data={bettingProviders}
              renderItem={({ item }) => (
                <View className="mt-2">
                  <List.Item
                    onPress={() => handleProviderSelect(item)}
                    title={item.name}
                    titleStyle={{ fontWeight: "bold" }}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <RNImage
                            className="h-10 w-10 rounded-full"
                            source={{ uri: item.image_url }}
                          />
                        )}
                      />
                    )}
                  />
                </View>
              )}
              ListEmptyComponent={
                <View>
                  {fetchingProcessing && (
                    <View className="items-center justify-center gap-y-3 mt-5">
                      <ActivityIndicator size={30} />
                      <Text>Loading Providers...</Text>
                    </View>
                  )}
                  {bettingProviders?.length <= 0 && !fetchingProcessing && (
                    <View className="flex-1 mt-5 items-center justify-center px-5 h-full">
                      <Image
                        className="h-[70px] w-[70px] self-center "
                        source={require("@/assets/images/gif/failed_anim.webp")}
                      />
                      <Text className="text-center text-lg mt-2 font-bold font-mono">
                        Network Disconnected
                      </Text>
                      <Text className="opacity-70 text-center">
                        Please check your network connection and press reload
                      </Text>
                      <Button
                        onPress={fetchProviders}
                        className="mt-5"
                        mode={"contained-tonal"}
                      >
                        Reload
                      </Button>
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
                <Text className="font-bold">Provider</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{selectedProvider?.name}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">ID</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{customerId}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{amount}</DataTable.Cell>
            </DataTable.Row>
          </View>
          <View className="absolute bottom-10 w-full mb-5 px-5 mt-5">
            <Button disabled={!idVerified} onPress={onConfirm} mode="contained">
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
      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default betting;
