import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  Appbar,
  TextInput,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { PaperSafeView } from "../PaperView";
import Processing from "../models/Processing";
import { EaseView } from "react-native-ease";
import { Timer } from "@/constants/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "../models/NetworkRequestErrorSheet";
import { Storage } from "@/constants/Storage";

const PhoneLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

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
    if (!phone) {
      showMessage({
        message: "Phone Error",
        description: "Please Enter valid Phone number",
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
        email: phone,
        password: password,
      },
    });

    console.log("response ", response);

    if (response.status == 0) {
      showMessage({
        message: "Login Failed",
        description: response.message,
        type: "danger",
        icon: "danger",
      });
      setShowProcessing(false);
      return;
    }

    if (response?.token) {
      showMessage({
        message: "Login",
        description: "Login successfuly",
        type: "success",
      });
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
      showMessage({
        message: `${error}`,
      });
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
            onPress={() => router.back()}
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
              Login with phone number
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
        className="h-auto min-h-[55%] w-screen"
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
              placeholder="Phone Number"
              keyboardType={"number-pad"}
              className="bg-transparent"
              onChangeText={setPhone}
              disabled={showProcessing}
              left={<TextInput.Icon size={20} icon="phone" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />
            <View>
              <TextInput
                placeholder="Password"
                className="bg-transparent"
                secureTextEntry={showPassword ? false : true}
                 disabled={showProcessing}
                left={<TextInput.Icon size={20} icon="lock" />}
                onChangeText={setPassword}
                right={
                  <TextInput.Icon
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? "eye-off" : "eye"}
                  />
                }
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
              />
              <View className="w-full items-end">
                <Button  disabled={showProcessing} mode="text" className="">
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

              <View className="flex-row items-center justify-center pt-0 pb-2">
                <Text>I Don't have an account</Text>
                <Button  disabled={showProcessing} onPress={() => router.push("/singup")}>Sing up</Button>
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

export default PhoneLoginComponent;
