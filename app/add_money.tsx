import { View, Pressable, Keyboard } from "react-native";
import React, { useCallback, useState } from "react";
import {
  Appbar,
  Button,
  Card,
  DataTable,
  Icon,
  PaperProvider,
  TextInput,
  useTheme,
  Text,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { PaperSafeView } from "@/components/PaperView";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { showMessage } from "react-native-flash-message";
import * as Clipboard from "expo-clipboard";
import { Toast } from "@/constants/Toast";
import CustomAppbar from "@/components/CustomAppbar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const add_money = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("1");
  const [virtualAccounts, setVirtualAccounts] = useState<
    Array<{ bankName: string; accountNumber: string; accountName: string }>
  >([]);

  const handleActiveTab = (tabID: string) => {
    setActiveTab(tabID);
  };

  useFocusEffect(
    useCallback(() => {
      getVirtualAccounts();
      return () => {};
    }, []),
  );

  const getVirtualAccounts = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const virtualAccounts = userInfo.virtual_accounts || [];
        setVirtualAccounts(virtualAccounts);
      }
    } catch (error) {
      console.error("Error fetching virtual accounts:", error);
    }
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

          <Appbar.Content title="Add Money" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </CustomAppbar>

        <View className="flex-row items-center justify-around">
          <Button
            onPress={() => handleActiveTab("1")}
            style={{
              borderBottomColor:
                activeTab == "1" ? theme.colors.primary : "transparent",
              borderWidth: 1,
              borderRadius: 0,
            }}
            className="rounded-0"
          >
            Bank Transfer
          </Button>
          <Button
            onPress={() => handleActiveTab("2")}
            style={{
              borderBottomColor:
                activeTab == "2" ? theme.colors.primary : "transparent",
              borderWidth: 1,
              borderRadius: 0,
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

              <Text className="text-center mt-4">Accounts</Text>
              {virtualAccounts.map((item) => (
                <Card
                  key={item?.accountNumber}
                  className="mt-2"
                  mode={"outlined"}
                >
                  <View>
                    <DataTable.Row>
                      <DataTable.Cell>
                        <Text className="font-bold">Bank Name</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{item?.bankName}</DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                      <DataTable.Cell>
                        <Text className="font-bold">Account Number</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Pressable
                          onPress={() => handleCopy(item?.accountNumber || "")}
                          className="flex-row items-center gap-x-2"
                        >
                          <Text>{item?.accountNumber}</Text>
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
                      <DataTable.Cell numeric>
                        {item?.accountName}
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                </Card>
              ))}

              {/** end Account 1 */}
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
            <Text
              style={{ textAlign: "center" }}
              className="text-center text-[16px] font-light"
            >
              Found Your wallet with one-time virtual account number
            </Text>

            <View className="px-3 mt-5 gap-y-5">
              <TextInput
                mode={"outlined"}
                placeholder={"Amount"}
                style={{ backgroundColor: "transparent" }}
                outlineStyle={{ borderRadius: 15 }}
                keyboardType={"number-pad"}
              />

              <View>
                <Button
                  onPress={() => {
                    Toast.warning({
                      title: "Dynamic founding",
                      body: "not available currently please try again later",
                    });
                  }}
                  labelStyle={{ fontSize: 17 }}
                  className="py-1 text-lg"
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
