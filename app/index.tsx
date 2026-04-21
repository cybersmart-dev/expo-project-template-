import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  Appbar,
  Dialog,
  Portal,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { PaperSafeView } from "@/components/PaperView";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import { Timer } from "@/constants/Utils";
import Fontisto from "@expo/vector-icons/Fontisto";

import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const theme = useTheme();
  const [loginOption, setLoginOption] = useState("");
  const [bounceState, setBounceState] = useState(0);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
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
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/logins/singin");
      }
    } catch (error) {}
  };

  return (
    <PaperSafeView>
      <Appbar style={{ backgroundColor: "transparent" }}>
        <Appbar.Content
          title={
            <MaskedView
              maskElement={<Text className="text-3xl font-bold">T-Pay</Text>}
            >
              <LinearGradient
                colors={[
                  theme.colors.onPrimaryContainer,
                  theme.colors.surfaceVariant,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-3xl font-bold opacity-0">T-Pay</Text>
              </LinearGradient>
            </MaskedView>
          }
          mode="small"
          style={{ alignItems: "flex-start" }}
        />
        <EaseView
          animate={{ translateX: loaded ? 0 : 200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Button mode={"contained-tonal"} className="mr-2">
            Help
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
            boxShadow: "0 0px 10px 10px rgba(0, 0, 0, 0.20)",
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
              Welcome To <Text className="font-bold">T-Pay</Text>
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
              App description here
            </Text>
          </EaseView>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        className="h-auto pt-7 w-screen justify-center rounded-t-[20px]"
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <EaseView
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginTop: 50,
            paddingBottom: 30,
            boxShadow: theme.dark ? undefined : CustomLightTheme.boxShadow,
          }}
          className="rounded-t-[30px] h-full justify-center "
          animate={{ translateY: loaded ? 0 : 100 }}
          transition={{ type: "timing", duration: 500, easing: "linear" }}
        >
          <View className="space-y-5 px-7 shadow-2xl">
            <EaseView
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <Button
                onPress={() => router.push("/logins/emailLogin")}
                icon={({ color }) => (
                  <Fontisto name="email" size={24} color={color} />
                )}
                className="p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
                mode="contained"
              >
                Login With Email
              </Button>
            </EaseView>
            <EaseView
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <Button
                onPress={() => router.push("/logins/phoneLogin")}
                icon={({ color }) => (
                  <AntDesign name="mobile" size={24} color={color} />
                )}
                mode="contained"
                className="p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
              >
                Login with phone
              </Button>
            </EaseView>

            <EaseView
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <Button
                onPress={() =>
                  showMessage({
                    message: "Login",
                    description:
                      "Social login not avilable. login with email instead",
                    type: "info",
                    icon: "info",
                  })
                }
                mode="contained"
                icon={({ color }) => (
                  <AntDesign name="google" size={24} color={color} />
                )}
                className="p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
              >
                Login With Google
              </Button>
              <View className="flex-row items-center justify-center mt-3">
                <Text className="">I Don't have an account</Text>
                <Button onPress={() => router.push("/singup")}>Sing up</Button>
              </View>
            </EaseView>
          </View>
        </EaseView>
      </KeyboardAvoidingView>

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
