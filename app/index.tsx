import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import PhoneLoginComponent from "@/components/login/PhoneLoginComponent";
import EmailLoginComponent from "@/components/login/EmailLoginComponent";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { PaperSafeView } from "@/components/PaperView";

const Index = () => {
  const theme = useTheme();
  const [loginOption, setLoginOption] = useState("");

  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  return (
    <PaperSafeView>
      <Appbar style={{ backgroundColor: "transparent" }}>
        <Appbar.Content
          title={
            <View>
              <Text className="text-lg font-thin text-white">Singin</Text>
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
            Help
          </Button>
        </EaseView>
      </Appbar>
      <View className="absolute top-[120px] space-y-5 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <Image
            className="h-14 w-14  rounded-full"
            source={require("../assets/images/profile_avatar.png")}
          />
        </EaseView>

        <View className="items-center">
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
              Welcome To AppName
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
                icon="email"
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
                icon="phone"
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
                icon="google"
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

      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default Index;
