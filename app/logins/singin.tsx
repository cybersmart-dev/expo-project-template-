import { useState, useCallback, useEffect } from "react";
import {
  View,
  Image,
  Keyboard,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import {
  Text,
  useTheme,
  Button as RNFButton,
  Appbar,
  TextInput,
  ActivityIndicator,
  Dialog,
  Portal,
  Icon,
  HelperText,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { showMessage } from "react-native-flash-message";
import { EaseView } from "react-native-ease";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperSafeView } from "@/components/PaperView";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import requests from "@/Network/HttpRequest";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import { Toast } from "@/constants/Toast";
import { Storage } from "@/constants/Storage";
import AnimatedTransLogo from "@/components/Animations/AnimatedTransLogo";
import { LightTheme } from "../_layout";
import BottomLayout from "@/components/Containers/BottomLayout";
import CustomAppbar from "@/components/CustomAppbar";
import { useNotification } from "@/contexts/NotificationContext";
import { ErrorStatusCode } from "@/constants/StatusCodes";
import AlertDialog from "@/components/models/AlertDialog";
import Button from "@/components/Buttons/Button";
import ExitAppAlertDialog from "@/components/models/ExitAppAlertDialog";
import LogoutAlertDialog from "@/components/models/LogoutAlertDialog";

const PhoneLoginComponent = () => {
  const theme = useTheme<typeof LightTheme>();

  const [password, setPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isBiometricLoginEnabled, setIsBiometricLoginEnabled] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState<{
    username: string;
    email: string;
  }>();
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
  const { notification, expoPushToken, error } = useNotification();
  const [loaded, setLoaded] = useState(false);
  const [fingerPrintIconColor, setFingerPrintIconColor] = useState("");
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

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
      loadDeviceID();
      setFingerPrintIconColor(theme.colors.onBackground);
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const loadDeviceID = async () => {
    let id = await requests.getDeviceID();
    console.log("Device ID", id);
  };

  useFocusEffect(
    useCallback(() => {
      getUserInfo();
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        if (showProcessing) {
          Toast.warning({ title: "Please wait while Processing..." });
          return true;
        }
        setExitDialogVisible(true);
        return true;
      });
      return () => back.remove();
    }, [showProcessing]),
  );
  const validateInput = () => {
    setPasswordError(false);
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Please Enter Your Password");
      Toast.danger({
        title: "Password Error",
        body: "Please Enter Your Password",
      });
      return;
    }

    login(userInfo?.email, password);
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

  const login = async (email: string | undefined, password: string) => {
    setShowProcessing(true);
    Keyboard.dismiss();

    const response = await requests.post({
      url: "/login/",
      add_header_token: false,
      data: { email: email, password: password },
    });

    if (response.token != undefined) {
      setShowProcessing(false);
      Toast.success({ title: "Login Success", body: "Welcome back!" });
      await saveLoginState(response.token);
      router.push({ pathname: "/(tabs)", params: { backFrom: "singin" } });
    }

    if (response.status == 0) {
      setShowProcessing(false);
      setFingerPrintIconColor(theme.colors.onBackground);
      setPasswordError(true);

      if (response.message?.toLowerCase()?.match("invalid login")) {
        setPasswordErrorMessage("Wrong Password");
        Toast.dangerHapticsAsync({
          title: "Login Failed",
          body: "Wrong Password",
        });
      } else {
        Toast.danger({ title: "Login Failed", body: response.message });
      }
    }
    if (response.status == undefined) {
      setFingerPrintIconColor(theme.colors.onBackground);
      setShowProcessing(false);
      setNetworkErrorSheetVisible(true);
      Toast.danger({
        title: "Network Error",
        body: "Please check your internet connection and try again.",
      });
    }
  };

  const saveLoginState = async (token: string) => {
    try {
      await AsyncStorage.setItem("token", token);
      const response = await requests.get({ url: "/networks/" });
      await Storage.SecureStore("networks", JSON.stringify(response));
    } catch (error) {}
  };

  const removeAccount = async () => {
    try {
      await requests.clearToken();
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
      if (available) {
        loadBiometricLoginState();
      }
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
      setFingerPrintIconColor("lightgreen");
      const auth = await Storage.secureGet("auth");
      if (auth) {
        const password = JSON.parse(auth)?.password;
        login(userInfo?.email, password);
      }
    } else {
      setFingerPrintIconColor("red");
      showMessage({
        message: "Failed",
        description: "Authentication failed: " + result.error,
        type: "danger",
        icon: "danger",
      });
      // Handle authentication failure
    }
  };

  const loadBiometricLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("BiometricLoginState");
      if (state?.trim() == "1") {
        setIsBiometricLoginEnabled(true);
        return;
      }

      setIsBiometricLoginEnabled(false);
    } catch (error) {}
  };

  useEffect(() => {
    setPasswordError(false);
    return () => {};
  }, [password]);

  return (
    <PaperSafeView
      onPress={() => Keyboard.dismiss()}
      style={{ backgroundColor: theme.colors.background }}
    >
      <CustomAppbar>
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
      </CustomAppbar>

      <View className="absolute top-[120px] space-y-0 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <AnimatedTransLogo />
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
      <BottomLayout>
        <View className="gap-y-1 px-7">
          {biometricAvailable && isBiometricLoginEnabled && (
            <View className="items-center mt-4">
              <TouchableOpacity
                disabled={showProcessing}
                onPress={fingerprintLogin}
                style={{ boxShadow: "0 0px 10px 5px rgba(0, 0, 0, 0.15)" }}
                className="p-4 rounded-full"
              >
                <Icon
                  source="fingerprint"
                  size={40}
                  color={fingerPrintIconColor || theme.colors.onBackground}
                />
              </TouchableOpacity>
              <Text className="font-bold  mt-2">Use FingerPrint</Text>
            </View>
          )}

          <View
            className={
              biometricAvailable && isBiometricLoginEnabled ? "mt-6" : "mt-10"
            }
          >
            <TextInput
              placeholder="Password"
              style={{ backgroundColor: "transparent" }}
              secureTextEntry={showPassword ? false : true}
              error={passwordError}
              left={<TextInput.Icon size={20} icon="key" />}
              onChangeText={setPassword}
              disabled={showProcessing}
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

            <HelperText type={"error"} visible={passwordError}>
              {passwordErrorMessage}
            </HelperText>
          </View>

          <View className="">
            <Button loading={showProcessing} onPress={() => validateInput()}>
              Login
            </Button>

            <View className="flex-row items-center justify-center pt-0 pb-2">
              <RNFButton
                disabled={showProcessing}
                onPress={() =>
                  router.push({
                    pathname: "/passwordreset/PasswordReset",
                    params: { autoFillEmail: userInfo?.email },
                  })
                }
              >
                Forgot Password
              </RNFButton>
              <Text>|</Text>
              <RNFButton
                disabled={showProcessing}
                onPress={() => setLogoutDialogVisible(true)}
              >
                Switch Account
              </RNFButton>
            </View>
          </View>
        </View>
      </BottomLayout>

      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />

      <LogoutAlertDialog
        visible={logoutDialogVisible}
        onDismiss={setLogoutDialogVisible}
        onLogout={() => removeAccount()}
        username={userInfo?.username}
      />

      {/* Exit dialog */}

      <ExitAppAlertDialog
        visible={exitDialogVisible}
        onDismiss={setExitDialogVisible}
      />

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default PhoneLoginComponent;
