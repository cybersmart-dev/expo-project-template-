import {
  View,
  TextInput as RNTextInput,
  Image,
  Pressable,
  GestureResponderEvent,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  DataTable,
  Divider,
  Icon,
  List,
  TextInput,
  useTheme,
  Text,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BettingProviders, CableTVSubscription } from "@/constants/DemoList";
import { NetworkImages } from "@/constants/Images";
import BottomSheet from "@/components/models/BottomSheet";
import { showMessage } from "react-native-flash-message";
import { Timer } from "@/constants/Utils";
import CableTvPreview from "@/components/Previews/CableTvPreview";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";

interface CableSelectInputProps {
  onSelect: (data: (typeof CableTVSubscription)[0]) => void;
  onChangeText?: ((text: string) => void) | undefined;
}

const CableSelectInput = ({
  onSelect,
  onChangeText,
}: CableSelectInputProps) => {
  const theme = useTheme();
  const [providerSelectSheetVisible, setProviderSelectSheetVisible] =
    useState(false);
  const [selectedCableProvider, setSelectedCableProvider] =
    useState<(typeof CableTVSubscription)[0]>();
  return (
    <View
      style={{ borderColor: theme.colors.onBackground }}
      className="border h-[55px] rounded-lg flex-row"
    >
      <Pressable
        onPress={() => setProviderSelectSheetVisible(true)}
        className="h-full w-auto items-center flex-row p-2 "
      >
        <View>
          <Image
            resizeMode={"stretch"}
            className="h-10 w-10 rounded-full"
            source={{ uri: selectedCableProvider?.icon }}
          />
        </View>
        <MaterialIcons
          name="keyboard-arrow-down"
          color={theme.colors.onBackground}
          size={24}
        />
      </Pressable>
      <RNTextInput
        onChangeText={onChangeText}
        style={{ color: theme.colors.onBackground }}
        placeholder="Enter IUD"
        placeholderTextColor={theme.colors.outline}
        className="flex-1 h-full text-[15px]"
        keyboardType={"numeric"}
      />
      <BottomSheet
        height={"auto"}
        visible={providerSelectSheetVisible}
        onDismiss={setProviderSelectSheetVisible}
      >
        <View>
          <View className="mt-2">
            <Text className="text-lg text-center"> Select Provider</Text>
          </View>

          <View className="mt-5 mb-5">
            <FlatList
              data={CableTVSubscription}
              renderItem={({ item }) => (
                <View className="px-5 mt-2">
                  <List.Item
                    onPress={() => {
                      onSelect(item);
                      setSelectedCableProvider(item);
                      setProviderSelectSheetVisible(false);
                    }}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <Image
                            resizeMode={"stretch"}
                            className="h-10 w-10 rounded-full"
                            source={{ uri: item.icon }}
                          />
                        )}
                      />
                    )}
                    title={item.name}
                  />
                  <Divider />
                </View>
              )}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const cabletv = () => {
  const theme = useTheme();
  const [selectedProvider, setSelectedProvider] =
    useState<(typeof CableTVSubscription)[0]>();
  const [verifyingIUC, setVerifyingIUC] = useState(false);
  const [iuc, setIuc] = useState("");

  const [IUCVerified, setIUCVerified] = useState(false);
  const [plansSheetVisible, setPlansSheetVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<(typeof CableTVSubscription)[0]["plans"][0]>();
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [previewSheetVisible, setPreviewSheetVisible] = useState(false);
  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);

  const handleShowProviders = (event: GestureResponderEvent): void => {
    //
  };

  const handleVerifyIUC = async (e: GestureResponderEvent) => {
    if (!selectedProvider) {
      showMessage({
        message: "Please Select Cable Provider",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!iuc) {
      showMessage({
        message: "Please Enter IUC",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    setVerifyingIUC(true);
    await new Timer().postDelayedAsync({ sec: 3000 });
    setVerifyingIUC(false);
    setIUCVerified(true);
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
        amount: 100,
        data: JSON.stringify({
          statusCode: 1,
          type: "betting",
          id: 1,
          charge: 0.0,
          cashback: 0.4,
          message: `You have successfuly send ${100} to id ${iuc}`,
        }),
      },
    });
  };

  const handleNext = async (e: GestureResponderEvent) => {
    if (!selectedProvider) {
      showMessage({
        message: "Please Select Cable Provider",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    if (!iuc) {
      showMessage({
        message: "Please Enter IUC",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (iuc && !IUCVerified) {
      setVerifyingIUC(true);
      await new Timer().postDelayedAsync({ sec: 3000 });
      setVerifyingIUC(false);
      setIUCVerified(true);
    }
    await new Timer().postDelayedAsync({sec:500})
    setPreviewSheetVisible(true);
  };

  const getPlans = () => {
    const cable = selectedProvider?.name ?? "";
    const plan = CableTVSubscription.find((item) => item.name == cable)?.plans;
    return plan;
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

          <Appbar.Content title="Cable TV" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
        <View className="p-2 space-y-5 mt-3">
          <View className="px-5 space-y-2 ">
            <Text className="text-[130x] font-bold">Enter IUC</Text>
            <View className="mt-2">
              <CableSelectInput
                onSelect={setSelectedProvider}
                onChangeText={setIuc}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                {IUCVerified && (
                  <View className="items-center flex-row space-x-1">
                    <Icon source={"check-circle"} color="green" size={20} />
                    <Text>{iuc}</Text>
                  </View>
                )}
              </View>
              <View className="self-end">
                {!verifyingIUC && (
                  <Button onPress={handleVerifyIUC} mode="contained-tonal">
                    Validate IUC
                  </Button>
                )}
                {verifyingIUC && (
                  <Button
                    disabled
                    onPress={handleVerifyIUC}
                    mode="contained-tonal"
                  >
                    <ActivityIndicator />
                  </Button>
                )}
              </View>
            </View>
          </View>

          <View className="px-5 space-y-2">
            <Text className="text-[130x] font-bold">Plan</Text>
            <Pressable
              onPress={() => {
                if (!selectedProvider) {
                  alert("Plaese Select Provider first");
                  return;
                }
                setPlansSheetVisible(true);
              }}
            >
              <TextInput
                mode="outlined"
                className="rounded-lg bg-transparent"
                value={selectedPlan ? selectedPlan?.name : ""}
                placeholder="Select Plan"
                outlineStyle={{ borderRadius: 15 }}
                editable={false}
                right={
                  <TextInput.Icon
                    size={24}
                    onPress={() => {
                      if (!selectedProvider) {
                        alert("Plaese Select Provider first");
                        return;
                      }
                      setPlansSheetVisible(true);
                    }}
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
          <View className="px-5 pt-5">
            <Button
              onPress={handleNext}
              disabled={verifyingIUC}
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
        visible={plansSheetVisible}
        onDismiss={setPlansSheetVisible}
        height={"50%"}
      >
        <View>
          <View className="mt-2">
            <Text className="text-lg text-center"> Select Plan</Text>
          </View>

          <View className="mt-5 mb-5">
            <FlatList
              data={getPlans()}
              renderItem={({ item }) => (
                <View className="px-5 mt-2">
                  <List.Item
                    onPress={() => {
                      setSelectedPlan(item);
                      setPlansSheetVisible(false);
                    }}
                    left={() => (
                      <List.Icon
                        icon={() => (
                          <Image
                            resizeMode={"stretch"}
                            className="h-10 w-10 rounded-full"
                            source={{ uri: selectedProvider?.icon }}
                          />
                        )}
                      />
                    )}
                    title={item.name}
                  />
                  <Divider />
                </View>
              )}
            />
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={previewSheetVisible}
        onDismiss={setPreviewSheetVisible}
      >
        <CableTvPreview
          onConfirm={async () => {
            setPreviewSheetVisible(false);
            await new Timer().postDelayedAsync({ sec: 500 });
            setTransactionPinSheetVisible(true);
          }}
          selectedProvider={selectedProvider}
          selectedPlan={selectedPlan}
          iuc={iuc}
        />
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

export default cabletv;
