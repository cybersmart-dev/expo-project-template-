import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  TextInput,
  Appbar,
  ActivityIndicator,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { PaperSafeView } from "../PaperView";
import { EaseView } from "react-native-ease";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "../models/NetworkRequestErrorSheet";
import { Toast } from "@/constants/Toast";
import { Storage } from "@/constants/Storage";

const EmailLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const processingRef = useRef<number>(null);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      showMessage({
        message: "Email Error",
        description: "Please Enter valid email Address",
        type: "danger",
      });
      return;
    }
    if (!password) {
      showMessage({
        message: "Password Error",
        description: "Please Enter Your Password",
        type: "danger",
      });
      return;
    }

    login();
  };

  const login = async () => {
    setShowProcessing(true);
    Keyboard.dismiss();

    const response = await requests.post({
      url: "/login/",
      add_header_token: false,
      data: {
        email: email,
        password: password,
      },
    });

    if (response.status == 0) {
      Toast.danger({ title: "Login Failed", body: response.message });
      setShowProcessing(false);
      return;
    }

    if (response?.token) {
      Toast.success({ title: "Login", body: "Login successfuly" });
      setShowProcessing(false);
      await saveLoginState(response?.token);
    }

    if (response.status == undefined) {
      setNetworkErrorSheetVisible(true);
      setShowProcessing(false);
      return;
    }
  };

  const saveLoginState = async (token: string) => {
    try {
      if (token) {
        
        let auth = JSON.stringify({
          token: token,
          password: password,
        });
        await Storage.SecureStore("auth", auth);

        const response = await requests.get({ url: "/networks/" })
        
        await Storage.SecureStore("networks", JSON.stringify(response))

        router.push("/(tabs)");
      }
    } catch (error) {
      Toast.danger({title:"Error", body: `${error}`})
    }
  };
  return (
    <PaperSafeView
      onPress={() => Keyboard.dismiss()}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar className="bg-transparent">
        <EaseView
          animate={{ translateX: loaded ? 0 : -200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Appbar.Action
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={size}
                color={color}
              />
            )}
            onPress={() => router.push("/")}
          />
        </EaseView>
        <Appbar.Content title />
        <EaseView
          animate={{ translateX: loaded ? 0 : 200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Button mode={"contained-tonal"} className="mr-2">
            Help
          </Button>
        </EaseView>
      </Appbar>
      <View className="absolute top-[70px] space-y-0 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <Image
            className="h-[150px] w-[200px]  rounded-full"
            source={require("@/assets/images/man_working.png")}
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
                color: theme.colors.onBackground,
                fontSize: 20,
              }}
            >
              Login With Email Address
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
                color: theme.colors.onBackground,
                fontSize: 13,
                marginBottom: 30,
                opacity: 0.5,
              }}
            >
              some description here
            </Text>
          </EaseView>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        className="h-auto min-h-[55%] w-screen "
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
            <TextInput
              placeholder="Email Address"
              keyboardType={"email-address"}
              className="bg-transparent"
              mode="outlined"
              disabled={showProcessing}
              outlineStyle={{ borderRadius: 15 }}
              onChangeText={setEmail}
              left={<TextInput.Icon size={20} icon="email" />}
            />

            <View>
              <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={showPassword ? false : true}
                left={<TextInput.Icon size={20} icon="lock" />}
                disabled={showProcessing}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
                className="bg-transparent"
                right={
                  <TextInput.Icon
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? "eye-off" : "eye"}
                  />
                }
              />
              <View className="w-full items-end">
                <Button disabled={showProcessing} mode="text" className="">
                  Forgot Password?
                </Button>
              </View>
            </View>

            <View className="">
              {showProcessing && (
                <Button
                  disabled
                  onPress={() => validateInput()}
                  className="text-lg p-1"
                  style={{ borderRadius: 15 }}
                  labelStyle={{ fontSize: 16 }}
                  mode="contained"
                >
                  <View className="flex-row">
                    <Text> </Text>
                    <ActivityIndicator size={25} />
                  </View>
                </Button>
              )}

              {!showProcessing && (
                <Button
                  onPress={() => validateInput()}
                  className="text-lg p-1"
                  style={{ borderRadius: 15 }}
                  labelStyle={{ fontSize: 16 }}
                  mode="contained"
                >
                  Login
                </Button>
              )}

              <View className="flex-row items-center justify-center pt-0 pb-3">
                <Text>I Don't have an account</Text>
                <Button disabled={showProcessing} onPress={() => router.push("/singup")}>Sing up</Button>
              </View>
            </View>
          </View>
        </EaseView>
      </KeyboardAvoidingView>

      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default EmailLoginComponent;
