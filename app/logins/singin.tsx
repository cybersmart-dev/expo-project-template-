import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  Appbar,
  TextInput,
  ActivityIndicator,
  Dialog,
  Portal,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { EaseView } from "react-native-ease";
import { Timer } from "@/constants/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperSafeView } from "@/components/PaperView";
import Entypo from "@expo/vector-icons/Entypo";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";

const PhoneLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    email: string;
  }>();
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      checkLoginState();
      getUserInfo();
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        setExitDialogVisible(true);
        return true;
      });
      return () => back.remove();
    }, []),
  );
  const validateInput = () => {
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

  const getUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
    return null;
  };

  const login = async () => {
    setShowProcessing(true);
    Keyboard.dismiss();


    const response = await requests.post({
      url: "/login/",
      add_header_token: false,
      data: { email: userInfo?.email, password: password },
    });

    if (response.token != undefined) {
      setShowProcessing(false);
      showMessage({
        message: "Login Success",
        description: "Welcome back!",
        type: "success",
      });
      saveLoginState(response.token);
      router.push("/(tabs)");
    }

    if (response.status == 0) {
      setShowProcessing(false);
      showMessage({
        message: "Login Failed",
        description: response.message,
        type: "danger",
      });
    }
    if (response.status == undefined) {
      setShowProcessing(false);
      setNetworkErrorSheetVisible(true);
      showMessage({
        message: "Network Error",
        description: "Please check your internet connection and try again.",
        type: "danger",
      });
    }
  };

  const checkLoginState = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userInfo");
        router.push("/logins/emailLogin");
      }
    } catch (error) {}
  };

  const saveLoginState = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {}
  };

  const removeAccount = async () => {
    try {
      await AsyncStorage.removeItem("loginState");
      await AsyncStorage.clear();
      router.push("/");
    } catch (error) {}
  };

  const hasBiometrics = async () => {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && isEnrolled;
  };

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await hasBiometrics();
      console.log("Biometric Avilable", available);

      setBiometricAvailable(available);
    };
    checkBiometrics();
  }, []);

  const fingerprintLogin = async () => {
    // Check if biometric hardware is available
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(
        "Not supported",
        "This device does not have biometric hardware.",
      );
      return;
    }

    // Check if biometric records are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(
        "No biometrics set up",
        "Please set up a fingerprint or face scan in your device settings.",
      );
      return;
    }

    // Authenticate the user
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to unlock the app",
      cancelLabel: "Use Password",
      promptSubtitle: "Login with biometric",
    });

    if (result.success) {
      showMessage({
        message: "Success!",
        description: "Authentication successful.",
        type: "success",
        icon: "success",
      });
      router.push("/(tabs)");
    } else {
      showMessage({
        message: "Failed",
        description: "Authentication failed: " + result.error,
        type: "danger",
        icon: "danger",
      });
      // Handle authentication failure
    }
  };
  return (
    <PaperSafeView
      onPress={() => Keyboard.dismiss()}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar className="bg-transparent">
        <Appbar.Content
          title={
            <MaskedView
              maskElement={<Text className="text-3xl font-bold">T-Pay</Text>}
            >
              <LinearGradient
                colors={[
                  theme.colors.onBackground,
                  theme.colors.inversePrimary,
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
      </Appbar>

      <View className="absolute top-[120px] space-y-0 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <Image
            className="h-[60px] w-[60px]  rounded-full"
            source={require("@/assets/images/profile_avatar.png")}
          />
        </EaseView>
        <View className="items-center pt-3">
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 200 }}
          >
            <Text
              className="flex-col"
              style={{
                color: theme.colors.onBackground,
                fontSize: 20,
              }}
            >
              Welcome Back
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
                fontWeight: "bold",
              }}
            >
              {userInfo?.username}!
            </Text>
          </EaseView>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        className="h-auto min-h-[40%]  w-screen"
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
          <View className="space-y-7 px-7 shadow-2xl">
            {biometricAvailable && (
              <View className="items-center">
                <TouchableOpacity
                  onPress={fingerprintLogin}
                  style={{ boxShadow: "0 0px 10px 5px rgba(0, 0, 0, 0.15)" }}
                  className="p-4 rounded-full"
                >
                  <Entypo
                    name="fingerprint"
                    size={40}
                    color={theme.colors.onBackground}
                  />
                </TouchableOpacity>
                <Text className="font-bold  mt-2">Use FingerPrint</Text>
              </View>
            )}

            <TextInput
              placeholder="Password"
              className="bg-transparent"
              secureTextEntry={showPassword ? false : true}
              left={<TextInput.Icon size={20} icon="key" />}
              onChangeText={setPassword}
              onSubmitEditing={() => validateInput()}
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
                <Text>Not my account?</Text>
                <Button onPress={() => removeAccount()}>Logout</Button>
              </View>
            </View>
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

      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default PhoneLoginComponent;
