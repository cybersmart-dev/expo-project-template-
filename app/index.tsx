import React, { useCallback, useState } from "react";
import { View, Image, BackHandler } from "react-native";
import {
  Text,
  useTheme,
  Button,
  Appbar,
  Dialog,
  Portal,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { PaperSafeView } from "@/components/PaperView";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Timer } from "@/constants/Utils";
import Fontisto from "@expo/vector-icons/Fontisto";

import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import requests from "@/Network/HttpRequest";
import { DarkTheme } from "./_layout";
import * as WebBrowser from "expo-web-browser";

const Index = () => {
  const theme = useTheme<typeof DarkTheme>();
  const [loginOption, setLoginOption] = useState("");
  const [bounceState, setBounceState] = useState(0);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loginCheckFinished, setLoginCheckFinished] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkLoginState();
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
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

  useFocusEffect(
    useCallback(() => {
      updateBounce();
      return () => {};
    }, [bounceState]),
  );

  const updateBounce = async () => {
    await new Timer().postDelayedAsync({ sec: 1000 });
    setBounceState(bounceState == 1 ? 0 : 1);
  };

  const checkLoginState = async () => {
    try {
      const token = await requests.getToken();

      if (token) {
        router.push("/logins/singin");
      }
      setLoginCheckFinished(true);
    } catch (error) {}
  };

  if (!loginCheckFinished) {
    return (
      <PaperSafeView>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={50} />
        </View>
      </PaperSafeView>
    );
  }

  return (
    <PaperSafeView>
      <Appbar style={{ backgroundColor: "transparent" }}>
        <Appbar.Content
          title={
            <View className="flex-row items-center">
              <Image
                className="h-[60px] w-[50px] mr-[-5px]  rounded-full"
                source={require("@/assets/images/icon_trans.png")}
              />
              <MaskedView
                maskElement={
                  <Text className="text-3xl font-bold font-[ArchivoBlackRegular]">
                    affy
                  </Text>
                }
              >
                <LinearGradient
                  colors={[
                    theme.colors.onPrimaryContainer,
                    theme.colors?.accent,
                  ]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text className="text-3xl font-bold opacity-0">affy</Text>
                </LinearGradient>
              </MaskedView>
            </View>
          }
          mode="small"
          style={{ alignItems: "flex-start" }}
        />
        <EaseView
          animate={{ translateX: loaded ? 0 : 200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Button mode={"contained-tonal"} className="mr-2">
            Skip
          </Button>
        </EaseView>
      </Appbar>
      <View className="absolute top-[80px] space-y-1 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: bounceState == 0 ? 0 : -10,
          }}
          transition={{ duration: 1000, type: "timing", easing: "easeInOut" }}
        >
          <Image
            className="h-[250px] w-[280px]  rounded-full"
            source={require("@/assets/images/women_home.png")}
          />
        </EaseView>
        <EaseView
          animate={{
            opacity: bounceState == 1 ? 0.3 : 0.7,
          }}
          transition={{ duration: 1000, type: "timing", easing: "easeInOut" }}
          style={{
            backgroundColor: theme.colors.elevation.level0,
            boxShadow: "0 0px 20px 10px rgba(0, 0, 0, 0.20)",
          }}
          className="bg-transparent rounded-full h-0 w-[200px]"
        ></EaseView>

        <View className="items-center pt-3">
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 200 }}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            >
              Welcome To{" "}
              <Text
                style={{ color: theme.colors.accent }}
                className="font-bold"
              >
                Zaffy
              </Text>
            </Text>
          </EaseView>

          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 400 }}
          >
            <Text
              style={{
                fontSize: 13,
                marginBottom: 30,
                opacity: 0.5,
              }}
            >
              Fast. Secure. Reliable.
            </Text>
          </EaseView>
        </View>
      </View>

      <View className="px-5 gap-y-3 w-screen  absolute bottom-0 mb-20">
        <Button
          onPress={() => router.push("/logins/emailLogin")}
          // icon={({ color }) => (
          //   <Fontisto name="email" size={24} color={color} />
          // )}
          className="p-1 py-1 flex-[0.5] bg-[#8181f166]"
          style={{
            borderRadius: 15,
          }}
          labelStyle={{ fontSize: 16, color: theme.colors.onBackground }}
          mode="outlined"
        >
          Login
        </Button>

        <Button
          onPress={() => router.push("/singup")}
          // icon={({ color }) => (
          //   <AntDesign name="mobile" size={24} color={color} />
          // )}
          mode={"outlined"}
          className="p-1 flex-[0.5] py-1 bg-[#ffa60042]"
          style={{
            borderRadius: 15,
          }}
          labelStyle={{ fontSize: 16, color: theme.colors.onBackground }}
        >
          SingUp
        </Button>

        <View>
          <Button
            onPress={async (e) => {
              e.preventDefault();
              await WebBrowser.openBrowserAsync("https://wa.me/+2347026426748");
            }}
            // icon={() => <IconButton icon={"face-agent"} />}
            mode={"outlined"}
            className="p-1 py-0"
            style={{
              borderRadius: 15,
            }}
            labelStyle={{ fontSize: 16, color: theme.colors.onBackground }}
          >
            Contact Support
          </Button>
        </View>
      </View>

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

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default Index;
