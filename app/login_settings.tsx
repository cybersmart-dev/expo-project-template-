import { Alert, Keyboard, Modal, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  List,
  RadioButton,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import CustomAppbar from "@/components/CustomAppbar";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "@/constants/Toast";
import * as LocalAuthentication from "expo-local-authentication";
import BottomSheet from "@/components/models/BottomSheet";
import TextInput from "@/components/Inputs/TextInput";
import Button from "@/components/Buttons/Button";
import { Timer } from "@/constants/Utils";
import requests from "@/Network/HttpRequest";

const login_settings = () => {
  const theme = useTheme();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [isBiometricLoginEnabled, setIsBiometricLoginEnabled] = useState(false);
  const [passwordChangeModalVisible, setPasswordChangeModalVisible] =
    useState(false);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [realPasswordError, setRealPasswordError] = useState(false);
  const [realPasswordErrorMessage, setRealPasswordErrorMessage] = useState("");
  const [realPassword, setRealPassword] = useState("");
  const [biometricOptionSheetVisible, setBiometricOptionSheetVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBiometricLoginState();
      return () => {};
    }, []),
  );

  const getUserEmail = async () => {
    try {
      const data = await AsyncStorage.getItem("userInfo");
      if (data) {
        const parsedData = JSON.parse(data);
        return parsedData?.email;
      }
    } catch (error) {}
  };
  const verifyPassword = async () => {
    if (!realPassword) {
      setRealPasswordError(true);
      setRealPasswordErrorMessage("Please enter your password");
      return;
    }

    const email = await getUserEmail();
    
    Keyboard.dismiss();
    setVerifyingPassword(true);

    const response = await requests.post({
      url: "/login/",
      add_header_token: false,
      data: { email: email, password: realPassword },
    });

    setVerifyingPassword(false);

    if (response.token != undefined) {
      setPasswordChangeModalVisible(false)
      router.push({
        pathname: "/changePassword",
        params: { realPassword: realPassword },
      });
    }

    if (response.status == 0) {
      setRealPasswordError(true);

      setRealPasswordErrorMessage("Wrong Password");
    }
    if (response.status == undefined) {
      Toast.danger({
        title: "Network Error",
        body: "Please check your internet connection and try again.",
      });
    }
  };

  const enableBiometicVerification = async () => {
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
      updateBiometricLoginState("1");
      setIsBiometricLoginEnabled(true);
      Toast.success({ title: "Biometric Enabled Successfuly" });
    } else {
      Toast.dangerHapticsAsync({
        title: "Failed",
        body: "Authentication failed: " + result.error,
      });
      // Handle authentication failure
    }
  };

  const loadBiometricLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("BiometricLoginState");
      if (state?.trim() == "1") {
        setIsSwitchOn(true);
        setIsBiometricLoginEnabled(true);
        return;
      }
      setIsSwitchOn(false);
      setIsBiometricLoginEnabled(false);
    } catch (error) {}
  };

  const updateBiometricLoginState = async (state: string) => {
    try {
      await AsyncStorage.setItem("BiometricLoginState", state);
    } catch (error) {
      Toast.dangerHapticsAsync({ title: "Failed to eneble biometric login" });
    }
  };

  const handleToggleSwitch = (value: boolean) => {
    alert(value);
  };

  const disableBiomeric = () => {
    setBiometricOptionSheetVisible(false);

    Alert.alert(
      "Disable Biometric login",
      "Are you sure do you want do disable login biometric",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () => {
            updateBiometricLoginState("0");
            setIsBiometricLoginEnabled(false);
            Toast.success({ title: "Biometric Disabled Successfuly" });
          },
        },
      ],
    );
  };

  const enebleBiometric = () => {
    setBiometricOptionSheetVisible(false);
    enableBiometicVerification();
  };

  useEffect(() => {
    setRealPasswordError(false);
    setRealPasswordErrorMessage("");
  }, [realPassword]);

  return (
    <PaperSafeView>
      <CustomAppbar>
        <Appbar.Action
          onPress={() => router.back()}
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />

        <Appbar.Content
          title={<Text className="text-lg font-bold">Login Settings</Text>}
        />
      </CustomAppbar>
      <View className="px-4">
        <List.Section>
          <List.Item
            titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
            descriptionStyle={{ opacity: 0.6 }}
            title="Reset Password"
            descriptionNumberOfLines={1}
            description="Did you forgot your password?"
            onPress={() =>
              router.push({ pathname: "/passwordreset/PasswordReset" })
            }
            left={({ color }) => (
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                <FontAwesome5
                  name={"lock"}
                  size={17}
                  color={theme.dark ? "lightgreen" : "green"}
                />
              </View>
            )}
            right={({ color }) => (
              <MaterialIcons
                name="keyboard-arrow-right"
                color={color}
                size={24}
              />
            )}
          />

          <List.Item
            titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
            descriptionStyle={{ opacity: 0.6 }}
            title="Change Password"
            descriptionNumberOfLines={1}
            description="Change your password"
            onPress={() => setPasswordChangeModalVisible(true)}
            left={({ color }) => (
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                <FontAwesome5
                  name={"sync"}
                  size={17}
                  color={theme.dark ? "lightgreen" : "green"}
                />
              </View>
            )}
            right={({ color }) => (
              <MaterialIcons
                name="keyboard-arrow-right"
                color={color}
                size={24}
              />
            )}
          />

          <List.Item
            titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
            descriptionStyle={{ opacity: 0.6 }}
            title="Login with FingerPrint"
            descriptionNumberOfLines={1}
            description="Enable Fingerprint Authentication"
            onPress={() => setBiometricOptionSheetVisible(true)}
            left={({ color }) => (
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                <FontAwesome5
                  name={"fingerprint"}
                  size={17}
                  color={theme.dark ? "lightgreen" : "green"}
                />
              </View>
            )}
            right={({ color }) => (
              <MaterialIcons
                name="keyboard-arrow-right"
                color={color}
                size={24}
              />
            )}
          />
        </List.Section>
      </View>

      <BottomSheet
        visible={biometricOptionSheetVisible}
        onDismiss={setBiometricOptionSheetVisible}
      >
        <View className="px-3">
          <List.Section>
            <List.Item
              title={"Enable"}
              onPress={enebleBiometric}
              right={() => (
                <RadioButton
                  onPress={enebleBiometric}
                  value=""
                  status={isBiometricLoginEnabled ? "checked" : "unchecked"}
                />
              )}
            />
            <List.Item
              onPress={disableBiomeric}
              title={"Disable"}
              right={() => (
                <RadioButton
                  onPress={disableBiomeric}
                  value=""
                  status={!isBiometricLoginEnabled ? "checked" : "unchecked"}
                />
              )}
            />
          </List.Section>
        </View>
      </BottomSheet>

      <Modal
        onRequestClose={() => setPasswordChangeModalVisible(false)}
        visible={passwordChangeModalVisible}
      >
        <PaperSafeView>
          <CustomAppbar>
            <Appbar.Action
              onPress={() => setPasswordChangeModalVisible(false)}
              icon={"close"}
            />
          </CustomAppbar>
          <View className="px-5 mt-5">
            <View className="gap-y-2">
              <Text className="ml-2">Enter Your Password</Text>
              <TextInput
                error={realPasswordError}
                errorMessage={realPasswordErrorMessage}
                onChangeText={setRealPassword}
                placeholder="Paaword"
              />
            </View>
            <Button onPress={verifyPassword} loading={verifyingPassword}>
              Continue
            </Button>
          </View>
        </PaperSafeView>
      </Modal>
    </PaperSafeView>
  );
};

export default login_settings;
