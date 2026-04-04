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

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{olj[ayj[j[cbj[ayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Index() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [hideBalance, setHideBalance] = useState(false);
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkLoginState()
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
    fetchData();
  }, []);

  const fetchData = async () => {
    fetch("https://example.org", {})
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(`Response: ${data}`);
      })
      .catch((error) => {
        //setNetworkErrorSheetVisible(true);
      });
  };

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

  const checkLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("loginState");
      console.log(state);

      if (state == null) {
        router.push("/logins/emailLogin");
        return;
      }
    } catch (error) {}
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
                  Hi <Text className="font-bold text-white">Mustapha!</Text>
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
            onPress={() => router.push("/contactus")}
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
              hideBalance={hideBalance}
              onHideBalanceToggle={() => setHideBalance(!hideBalance)}
            />
          </View>

          <View className="p-3">
            <Text className="mb-4 ml-2 font-bold">Quick Actions</Text>
            <HomeQuickActionsContainer />
          </View>
          <View className="p-3">
            <HomeSliderContainer />
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

        <BottomSheet
          visible={networkErrorSheetVisible}
          onDismiss={setNetworkErrorSheetVisible}
          mode={"center"}
          backgroundColor={"#ffc7c7"}
        >
          <View className="items-center p-5 px-5 bg-[]">
            <Image
              className="h-32 w-32"
              source={require("@/assets/images/gif/no_connection_anim.gif")}
            />
            <Text className="font-bold mt-2 text-red-800">
              Please check your network and try again
            </Text>
          </View>
          <View className="p-3">
            <Button
              onPress={() => setNetworkErrorSheetVisible(false)}
              mode="outlined"
            >
              Ok
            </Button>
          </View>
        </BottomSheet>
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
                setExitDialogVisible(false)
                BackHandler.exitApp()
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
