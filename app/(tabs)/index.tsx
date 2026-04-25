import BalanceContainer from "@/components/Containers/BalanceContainer";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StatusBar as RNStatusBar,
  useColorScheme,
  BackHandler,
  GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTheme,
  Text,
  Appbar,
  Button,
  Dialog,
  Portal,
} from "react-native-paper";
import { HomeQuickActionsContainer } from "@/components/Containers/HomeQuickActionsContainer";
import ServicesContainer from "@/components/Containers/ServicesContainer";
import HomeSliderContainer from "@/components/Containers/HomeSliderContainer";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import CreatePinContainer from "@/components/Containers/CreatePinContainer";
import { StatusBar } from "expo-status-bar";
import {} from "expo-image";
import { EaseView } from "react-native-ease";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import requests from "@/Network/HttpRequest";
import { showMessage } from "react-native-flash-message";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import RecentTransactionsContainer from "@/components/Containers/RecentTransactionsContainer";

export default function Index() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [hideBalance, setHideBalance] = useState(false);
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(false)
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkLoginState();
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

  const fetchData = async () => {
   setFetchingInfo(true)
    const response = await requests.get({ url: "/user/details/" });

    setFetchingInfo(false);

    if (response.status == 1) {
      setUserInfo(response.data);
      storeUserInfo(response.data);
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
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
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

  return (
    <LinearGradient
      colors={[theme.colors.secondaryContainer, theme.colors.background]}
      className="flex-1"
    >
      <EaseView
        animate={{
          scale: loaded ? 1 : 1.2,
        }}
        transition={{ type: "timing", duration: 500, easing: "linear" }}
        style={{ backgroundColor: theme.colors.background }}
        className="flex flex-1"
      >
        <Appbar
          style={{
            backgroundColor: theme.dark
              ? theme.colors.primaryContainer
              : theme.colors.primary,
            paddingTop: RNStatusBar.currentHeight,
          }}
        >
          <Appbar.Content
            title={
              <TouchableOpacity
                onPress={() => router.push("/me")}
                className="flex-row items-center space-x-2"
              >
                <Image
                  className="h-7 w-7 rounded-full"
                  source={require("@/assets/images/profile_avatar.png")}
                />
                <Text className="text-white">
                  Hi{" "}
                  <Text className="font-bold text-white">
                    {userInfo?.username || <Button>Refresh</Button>}!
                  </Text>
                </Text>
              </TouchableOpacity>
            }
          />
          <Appbar.Action
            onPress={() => router.push("/notifications")}
            color="white"
            icon={"bell-outline"}
          />
          <Appbar.Action
            onPress={async () => {
              await WebBrowser.openBrowserAsync("https://wa.me/+2347026426748");
            }}
            color="white"
            icon={"face-agent"}
          />
        </Appbar>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={fetchData} />
          }
          className="pb-5 flex-1"
        >
          <View className="">
            <BalanceContainer
              theme={theme}
              fetchingInfo={fetchingInfo}
              fetchInfo={fetchData}
              userInfo={userInfo}
              hideBalance={hideBalance}
              onHideBalanceToggle={() => setHideBalance(!hideBalance)}
            />
          </View>

          <View className="p-3">
            <Text className="mb-4 ml-2 font-bold">Quick Actions</Text>
            <HomeQuickActionsContainer />
          </View>
          <View className="p-3">
           <RecentTransactionsContainer />
          </View>
          <View className="px-3 mb-3">
            <Text className="mb-3 ml-2 font-bold">Services</Text>
            <ServicesContainer />
          </View>
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

      <NetworkRequestErrorSheet visible={networkErrorSheetVisible} onDismiss={setNetworkErrorSheetVisible} />
        <StatusBar key={1} style="light" />
      </EaseView>
      <Portal>
        <Dialog
          visible={exitDialogVisible}
          onDismiss={() => setExitDialogVisible(false)}
        >
          <Dialog.Title>Exit</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure do you want exit</Text>
          </Dialog.Content>
          <Dialog.Actions className="">
            <Button
              buttonColor="#f41c1c6b"
              textColor={theme.colors.onBackground}
              className="w-20"
              onPress={() => {
                setExitDialogVisible(false);
                BackHandler.exitApp();
              }}
              mode={"contained-tonal"}
            >
              Yes
            </Button>
            <Button
              textColor="black"
              buttonColor="lightgreen"
              className="w-20"
              onPress={() => setExitDialogVisible(false)}
              mode={"contained-tonal"}
            >
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
}
