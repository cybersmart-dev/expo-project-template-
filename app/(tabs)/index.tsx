import BalanceContainer from "@/components/Containers/BalanceContainer";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
  BackHandler,
  Pressable,
} from "react-native";
import { useTheme, Text, Appbar, Icon } from "react-native-paper";
import { HomeQuickActionsContainer } from "@/components/Containers/HomeQuickActionsContainer";
import ServicesContainer from "@/components/Containers/ServicesContainer";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import CreatePinContainer from "@/components/Containers/CreatePinContainer";
import { StatusBar } from "expo-status-bar";
import {} from "expo-image";
import { EaseView } from "react-native-ease";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import requests from "@/Network/HttpRequest";
import { showMessage } from "react-native-flash-message";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import RecentTransactionsContainer from "@/components/Containers/RecentTransactionsContainer";
import { PaperSafeView } from "@/components/PaperView";
import CustomAppbar from "@/components/CustomAppbar";
import { useNotification } from "@/contexts/NotificationContext";
import { Storage } from "@/constants/Storage";
import ExitAppAlertDialog from "@/components/models/ExitAppAlertDialog";
import { formatNumber } from "@/constants/Formats";
import AlertDialog from "@/components/models/AlertDialog";
import Button from "@/components/Buttons/Button";
import ActionButton from "@/components/Buttons/ActionButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LargeActionButton from "@/components/Buttons/LargeActionButton";

export default function Index() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { notification, expoPushToken, error } = useNotification();
  const [hideBalance, setHideBalance] = useState(false);
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [
    airtime2CashTransferOptionDialogVisible,
    setAirtime2CashTransferOptionDialogVisible,
  ] = useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    savePushToken();
  }, [expoPushToken]);

  const savePushToken = async () => {
    try {
      if (expoPushToken) {
        await Storage.SecureStore("pushToken", expoPushToken);
      }
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  useEffect(() => {
    if (!true) {
      setShowPinSheet(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setFetchingInfo(true);
    const response = await requests.get({ url: "/user/details/" });

    setFetchingInfo(false);

    if (response.status == 1) {
      setUserInfo(response.data);
      storeUserInfo(response.data);

      const transaction_pin = response?.data?.transaction_pin;
      if (!transaction_pin) {
        router.push({
          pathname: "/PinManagement/CreateTransactionPin",
          params: { action: "create" },
        });
      }
    }

    if (response.status == 0) {
      showMessage({
        message: "Error",
        description: response.message,
        type: "danger",
      });
    }

    if (response.status == undefined) {
      loadUserInfo();
      setNetworkErrorSheetVisible(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [refreshKey]),
  );

  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        setExitDialogVisible(true);
        return true;
      });
      return () => {
        back.remove();
      };
    }, []),
  );

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        setUserInfo(JSON.parse(userInfoString));
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const storeUserInfo = async (userInfo: any) => {
    try {
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error storing user info:", error);
    }
  };

  const checkLoginState = async () => {
    try {
      const loginState = (await AsyncStorage.getItem("token")) == null;

      if (loginState) {
        router.push("/logins/emailLogin");
      }
    } catch (error) {
      console.error("Error checking login state:", error);
    }
  };

  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <PaperSafeView>
      <EaseView
        animate={{
          scale: loaded ? 1 : 1.2,
        }}
        transition={{ type: "timing", duration: 500, easing: "linear" }}
        style={{ flex: 1 }}
      >
        <CustomAppbar>
          <Appbar.Content
            title={
              <TouchableOpacity
                onPress={() => router.push("/me")}
                className="flex-row items-center gap-x-2 ml-2"
              >
                <Image
                  className="h-7 w-7 rounded-full"
                  source={require("@/assets/images/profile_avatar.png")}
                />
                <Text className="">
                  Hi{" "}
                  <Text className="font-bold">
                    {userInfo?.username || "..."}!
                  </Text>
                </Text>
              </TouchableOpacity>
            }
          />
          <Appbar.Action
            onPress={() => router.push("/notifications")}
            icon={"bell-outline"}
          />
          <Appbar.Action
            onPress={async () => {
              await WebBrowser.openBrowserAsync("https://wa.me/+2347026426748");
            }}
            icon={"face-agent"}
          />
        </CustomAppbar>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refreshData} />
          }
          className="pb-5 flex-1"
        >
          <Pressable>
            <View className="px-5 rounded-t-2xl mt-3">
              <BalanceContainer
                theme={theme}
                fetchingInfo={fetchingInfo}
                fetchInfo={refreshData}
                userInfo={userInfo}
                hideBalance={hideBalance}
                onHideBalanceToggle={() => setHideBalance(!hideBalance)}
              />
              <Pressable
                onPress={() => setAirtime2CashTransferOptionDialogVisible(true)}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                className="mt-2 rounded-b-2xl w-full px-3 flex-row items-center p-2 justify-between"
              >
                <View className="flex-row items-center gap-x-5">
                  <Text className="opacity-75">Airtime2Cash</Text>

                  <Text style={{ fontWeight: "bold" }}>
                    ₦{formatNumber(userInfo?.wallet?.airtime2cash) || "0.00"}
                  </Text>
                </View>
                <EaseView
                  animate={{
                    translateX: loaded ? 0 : -50,
                    opacity: loaded ? 1 : 0,
                  }}
                  transition={{ duration: 1500, type: "timing" }}
                >
                  <Icon source={"arrow-right"} size={17} />
                </EaseView>
              </Pressable>
            </View>

            <View className="px-3 mt-3">
              <Text className="mb-1 ml-4 mt-4 font-bold opacity-70 uppercase text-[11px]">
                Quick Actions
              </Text>
              <HomeQuickActionsContainer />
            </View>

            <View className="px-3 mt-5">
              <Text className="font-bold ml-4 opacity-70 uppercase text-[11px]">
                Recent Transactions
              </Text>
              <RecentTransactionsContainer refreshKey={refreshKey} />
            </View>

            <View className="px-3 mt-5">
              <Text className="mb-1 ml-5 font-bold opacity-70 uppercase text-[11px]">
                Services
              </Text>
              <ServicesContainer />
            </View>
          </Pressable>
        </ScrollView>
        <BottomSheet
          mode="full-width"
          dismissable={true}
          visible={showPinSheet}
          onDismiss={() => setShowPinSheet(false)}
        >
          <CreatePinContainer
            onSkip={() => setShowPinSheet(false)}
            onCreate={(pin: string) => alert("pin created " + pin)}
          />
        </BottomSheet>

        <NetworkRequestErrorSheet
          visible={networkErrorSheetVisible}
          onDismiss={setNetworkErrorSheetVisible}
        />
        <StatusBar style={theme.dark ? "light" : "dark"} />
      </EaseView>
      <ExitAppAlertDialog
        visible={exitDialogVisible}
        onDismiss={setExitDialogVisible}
      />
      <AlertDialog
        visible={airtime2CashTransferOptionDialogVisible}
        onDismiss={setAirtime2CashTransferOptionDialogVisible}
        backgroundColor={theme.colors.surfaceVariant}
        height={300}
      >
        <View className="h-full flex-1 justify-between">
          <View className="items-center w-full mt-2">
            <Text
              style={{ fontFamily: "ArchivoBlackRegular" }}
              className="font-bold  text-2xl uppercase"
            >
              Airtime2Cash
            </Text>
          </View>

          <View className="px-3 w-full">
            <Text
              style={{ textAlign: "center", fontWeight: "bold" }}
              className="opacity-75 text-2xl"
            >
              ₦{formatNumber(userInfo?.wallet?.airtime2cash) || "0.00"}
            </Text>
          </View>

          <View className="flex-row px-2 gap-x-3 w-full items-center justify-center mb-3">
            <LargeActionButton
              onPress={() => {
                setAirtime2CashTransferOptionDialogVisible(false);
                router.push("/widthdraw");
              }}
              icon={"bank"}
              label="Withdraw"
              description="Transfer to your bank account"
            />

            <LargeActionButton
              onPress={() => {
                setAirtime2CashTransferOptionDialogVisible(false);
                router.push("/transfer");
              }}
              icon={({ color }) => (
                <FontAwesome6
                  name="money-bill-transfer"
                  size={24}
                  color={color}
                />
              )}
              description="Transfer to your zaffy wallet"
              label="Transfer"
            />
          </View>
        </View>
      </AlertDialog>
    </PaperSafeView>
  );
}
