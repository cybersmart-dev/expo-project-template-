import { View, Pressable, Keyboard } from "react-native";
import React, { useState } from "react";
import {
  Appbar,
  Button,
  Card,
  DataTable,
  Icon,
  PaperProvider,
  TextInput,
  useTheme,
  Text
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { PaperSafeView } from "@/components/PaperView";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { showMessage } from "react-native-flash-message";
import * as Clipboard from "expo-clipboard";
import { Toast } from "@/constants/Toast";

const add_money = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("1");

  const handleActiveTab = (tabID: string) => {
    setActiveTab(tabID);
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);

    showMessage({
      message: "Copied",
      type: "success",
      icon: "success",
    });
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

          <Appbar.Content title="Add Money" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>

        <View className="flex-row items-center justify-around">
          <Button
            onPress={() => handleActiveTab("1")}
            style={{
              borderBottomColor:
                activeTab == "1" ? theme.colors.primary : "transparent",
              borderWidth: 1,
            }}
            className="rounded-none"
          >
            Bank Transfer
          </Button>
          <Button
            onPress={() => handleActiveTab("2")}
            style={{
              borderBottomColor:
                activeTab == "2" ? theme.colors.primary : "transparent",
              borderWidth: 1,
            }}
            className="rounded-none"
          >
            Dynamic Founding
          </Button>
        </View>

        <EaseView
          animate={{ translateX: activeTab == "1" ? 0 : -500 }}
          transition={{ type: "timing", duration: 300 }}
          className="h-full w-full"
          style={{ display: activeTab == "1" ? "flex" : "none" }}
        >
          <View className="p-5">
            <View
              style={{ backgroundColor: theme.colors.surfaceVariant }}
              className="p-3 rounded-lg"
            >
              <Text className="text-center text-[15px] font-bold">
                Copy Any account number blow and found your wallet
              </Text>

              {/** Account 1 */}

              <Text className="text-center mt-4">Account 1</Text>
              <Card className="mt-2" mode={"outlined"}>
                <View>
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Bank Name</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{"Opay"}</DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Account Number</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Pressable
                        onPress={() => handleCopy("080")}
                        className="flex-row items-center space-x-2"
                      >
                        <Text>{7026426738}</Text>
                        <Pressable>
                          <Icon source={"content-copy"} size={17} />
                        </Pressable>
                      </Pressable>
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Account Name</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{"Mustapha Aminu"}</DataTable.Cell>
                  </DataTable.Row>
                </View>
              </Card>

              {/** end Account 1 */}

              {/** Account 2 */}

              <Text className="text-center mt-4">Account 2</Text>
              <Card className="mt-2" mode={"outlined"}>
                <View>
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Bank Name</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{"Opay"}</DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Account Number</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {" "}
                      <Pressable
                        onPress={() => handleCopy("080")}
                        className="flex-row items-center space-x-2"
                      >
                        <Text>{7026426738}</Text>
                        <Pressable>
                          <Icon source={"content-copy"} size={17} />
                        </Pressable>
                      </Pressable>
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text className="font-bold">Account Name</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{"Mustapha Aminu"}</DataTable.Cell>
                  </DataTable.Row>
                </View>
              </Card>

              {/** end Account 2 */}
            </View>
          </View>
        </EaseView>

        <EaseView
          animate={{ translateX: activeTab == "2" ? 0 : 500 }}
          transition={{ type: "timing", duration: 300 }}
          className="h-full w-full"
          style={{ display: activeTab == "2" ? "flex" : "none" }}
        >
          <View className="p-3 mt-5">
            <Text className="text-center text-[16px] font-light">
              Found Your wallet with one-time virtual account number
            </Text>

            <View className="px-3 mt-5 space-y-5">
              <TextInput
                mode={"outlined"}
                placeholder={"Amount"}
                className="bg-transparent"
                outlineStyle={{ borderRadius: 15 }}
                keyboardType={'number-pad'}
              />

              <View>
                <Button
                  onPress={() => {
                    Toast.warning({title:"Dynamic founding", body: "not available currently please try again later"})
                  }}
                  labelStyle={{ fontSize: 17 }}
                  className="p-1 text-lg"
                  mode={"contained"}
                >
                  Next
                </Button>
              </View>
            </View>
          </View>
        </EaseView>
      </View>

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default add_money;
