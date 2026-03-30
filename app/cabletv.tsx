import {
  View,
  Text,
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
  Button,
  Icon,
  List,
  TextInput,
  useTheme,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BettingProviders } from "@/constants/DemoList";
import { NetworkImages } from "@/constants/Images";
import BottomSheet from "@/components/models/BottomSheet";

const CableTVSubscription = [
  {
    id: 1,
    name: "GOTV",
    icon: "",
  },
  {
    id: 2,
    name: "DSTV",
    icon: "",
  },
  {
    id: 3,
    name: "StartTime",
    icon: "",
  },
];

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
    <View className="border h-[55px] rounded-lg flex-row">
      <Pressable
        onPress={() => setProviderSelectSheetVisible(true)}
        className="h-full w-auto items-center flex-row p-2 "
      >
        <Image
          className="h-8 w-8 rounded-full"
          source={{
            uri: NetworkImages.MtnImageLogo,
          }}
        />
        <MaterialIcons
          name="keyboard-arrow-down"
          color={theme.colors.onBackground}
          size={24}
        />
      </Pressable>
      <RNTextInput
        onChangeText={onChangeText}
        placeholder="Enter IUD"
        placeholderTextColor={theme.colors.outline}
        className="text-black flex-1 h-full text-[15px]"
        keyboardType={"numeric"}
      />
      <BottomSheet
        height={"50%"}
        visible={providerSelectSheetVisible}
        onDismiss={setProviderSelectSheetVisible}
      >
        <View>
          <View className="mt-2">
            <Text className="text-lg text-center"> Select Provider</Text>
          </View>

          <View className="mt-5">
            <FlatList
              data={CableTVSubscription}
              renderItem={({ item }) => (
                <View className="px-5 mt-2">
                  <List.Item
                    onPress={() => {
                      onSelect(item)
                      setProviderSelectSheetVisible(false)
                    }}
                    left={() => <List.Icon icon={"television"} />}
                    title={item.name}
                  />
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
    useState<(typeof BettingProviders)[0]>();
  const [verifyingID, setVerifyingID] = useState(false);

  const [idVerified, setIdVerified] = useState(false);
  function handleShowProviders(event: GestureResponderEvent): void {}

  function handleVerifyID(e: GestureResponderEvent): void {}

  function handleNext(e: GestureResponderEvent): void {}

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
                onSelect={(data) => {
                  
                  
                }}
                onChangeText={(text) => {
                  console.log(text);
                  
                }}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                {idVerified && (
                  <View className="items-center flex-row space-x-1">
                    <Icon source={"check-circle"} color="green" size={20} />
                    <Text>{}</Text>
                  </View>
                )}
              </View>
              <View className="self-end">
                {!verifyingID && (
                  <Button onPress={handleVerifyID} mode="contained-tonal">
                    Validate IUC
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

          <View className="px-5 space-y-2">
            <Text className="text-[130x] font-bold">Plan</Text>
            <Pressable onPress={handleShowProviders}>
              <TextInput
                mode="outlined"
                className="rounded-lg"
                value={selectedProvider ? selectedProvider.name : ""}
                placeholder="Select Plan"
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
      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default cabletv;
