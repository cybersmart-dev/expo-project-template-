import {
  View,
  Keyboard,
  Image,
  LayoutChangeEvent,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  ActivityIndicator,
  Appbar,
  Button,
  TextInput,
  useTheme,
  Text,
  IconButton,
  Portal,
  Dialog,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EaseView } from "react-native-ease";
import BottomLayout from "@/components/Containers/BottomLayout";
import { StatusBar } from "expo-status-bar";
import NetworkRequestErrorSheet from "@/components/models/NetworkRequestErrorSheet";
import { Toast } from "@/constants/Toast";
import requests from "@/Network/HttpRequest";
import OtpInput from "@/components/Inputs/OtpInput";
import Processing from "@/components/models/Processing";
import { useCounter } from "@/constants/Hooks";
import CustomAppbar from "@/components/CustomAppbar";
import AnimatedTransLogo from "@/components/Animations/AnimatedTransLogo";

const PasswordReset = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [otpSended, setOtpSended] = useState(false);
  const [emailError, setEmailError] = useState(false)
  const [resendOtpProcessing, setResendOtpProcessing] = useState(false);
  const { resendCount, startCounter } = useCounter({ count: 30 });

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [bottomLayoutHeight, setBottomLayoutHeight] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [otpVerifyToken, setOtpVerifyToken] = useState<string | undefined>("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<
    string | undefined
  >("");

  const [otp, setOtp] = useState("");
  const [exitDialogVisible, setExitDialogVisible] = useState(false);

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setEmailError(true)
      Toast.danger({
        title: "Email Error",
        body: "Please Enter valid email Address",
      });
      return;
    }

    setEmailError(false)
    reset();
  };

  useEffect(() => {
    setEmailError(false)
  }, [email])
  

  const reset = async () => {
    Keyboard.dismiss();
    setShowProcessing(true);
    const response = await requests.post({
      url: "/auth/password-less/otp/send/",
      add_header_token: false,
      data: {
        email: email,
      },
    });

    setShowProcessing(false);

    if (response.status == 0) {
      Toast.danger({ title: response?.message });
    }

    if (response.status == 1) {
      setOtpSended(true);
      setOtpVerifyToken(response?.token);

      Toast.success({ title: "OTP Send to your email address" });
      startCounter();
    }
    if (response.status == undefined) {
      Toast.danger({ title: response?.message });
    }
  };

  const handleResend = async () => {
    setResendOtpProcessing(true);
    await reset();
    setResendOtpProcessing(false);
  };

  const verifyOtp = async () => {
    Keyboard.dismiss();
    setResendOtpProcessing(true);
    const response = await requests.post({
      url: "/auth/password-less/otp/verify/",
      add_header_token: false,
      data: {
        token: otpVerifyToken,
        otp: otp,
        email: email,
      },
    });
    setResendOtpProcessing(false);

    if (response.status == 0) {
      Toast.danger({ title: response?.message });
    }

    if (response.status == 1) {
      setOtpVerified(true);
      setPasswordResetToken(response?.token);
      Toast.success({ title: "OTP Verified Successfully" });
    }
    if (response.status == undefined) {
      Toast.danger({ title: response?.message });
    }
  };

  const handleChangePassword = () => {
    if (newPassword.trim().length < 6) {
      Toast.danger({
        title: "Invalid password",
        body: "Password most be 6 characters or higher",
      });
      return;
    }

    if (newPassword.trim() != newPassword2.trim()) {
      Toast.danger({
        title: "Invalid password",
        body: "All two passwords most be match",
      });
      return;
    }

    confirmPasswordReset();
  };

  const confirmPasswordReset = async () => {
    setShowProcessing(true);
    const response = await requests.post({
      url: "/auth/password-reset/create/",
      add_header_token: false,
      data: {
        password: newPassword,
        token: passwordResetToken,
      },
    });
    setShowProcessing(false);

    if (response.status == 0) {
      Toast.danger({ title: response?.message });
    }

    if (response.status == 1) {
      Toast.success({ title: response.message });
      router.back();
    }
    if (response.status == undefined) {
      Toast.danger({ title: response?.message });
    }
  };
  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <CustomAppbar>
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

        <Appbar.Content title="Reset Password" />

        <Button mode={"contained-tonal"} className="mr-2">
          Help
        </Button>
      </CustomAppbar>

      <View className="absolute top-[150px] gap-y-0 px-5 w-full items-center justify-center">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <AnimatedTransLogo />
        </EaseView>
        <View className="items-center">
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            transition={{ duration: 1000, type: "timing", delay: 200 }}
            className="mt-3"
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontSize: 20,
              }}
            >
              {!otpSended && !otpVerified && " Password Reset"}

              {otpSended && !otpVerified && "Verify OTP"}
              {otpSended && otpVerified && "Create Password"}
            </Text>
          </EaseView>
          <EaseView
            animate={{
              opacity: loaded ? 1 : 0,
              translateY: loaded ? 0 : -20,
            }}
            className="px-5 mt-3"
            transition={{ duration: 1000, type: "timing", delay: 400 }}
          >
            {!otpSended && !otpVerified && (
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 13,
                  marginBottom: 30,
                  opacity: 0.5,
                  textAlign:"center"
                }}
                className="text-center place-items-center grid"
              >
                Please Provide your email address to reset your password
              </Text>
            )}

            {otpSended && !otpVerified && (
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 13,
                  marginBottom: 30,
                  opacity: 0.5,
                }}
                className="text-center "
              >
                We have been send otp to your email address{" "}
                <Text className="font-[ArchivoBlackRegular]">{email}</Text>.
                dont forget to check spam folder
              </Text>
            )}

            {otpSended && otpVerified && (
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 13,
                  marginBottom: 30,
                  opacity: 0.5,
                }}
                className="text-center "
              >
                You can now create new password 🔒
              </Text>
            )}
          </EaseView>
        </View>
      </View>
      <EaseView
        animate={{
          translateX: otpSended ? -10 : 0,
          opacity: otpSended ? 1 : 0,
        }}
        style={{
          marginBottom: bottomLayoutHeight,
          position: "absolute",
          bottom: 0,
          marginLeft: 3,
        }}
        className="absolute bottom-0 ml-3"
      >
        <Button
          onPress={() => {
            setOtpSended(false);
            setOtpVerified(false);
          }}
          icon={"arrow-left"}
        >
          Back
        </Button>
      </EaseView>
      <BottomLayout
        onLayout={(event: LayoutChangeEvent) => {
          const height = event.nativeEvent.layout.height;
          setBottomLayoutHeight(height);
        }}
      >
        <View className="mt-12">
          {!otpSended && !otpVerified && (
            <View className="gap-y-5 px-3">
              <View className="gap-y-5 px-5">
                <TextInput
                  placeholder="Email Address"
                  keyboardType={"email-address"}
                  error={emailError}
                  style={{ backgroundColor: "transparent" }}
                  mode="outlined"
                  outlineStyle={{ borderRadius: 15 }}
                  onChangeText={setEmail}
                  autoFocus={true}
                  focusable={true}
                  left={<TextInput.Icon size={20} icon="email" />}
                />
              </View>
              <View className="px-5">
                {showProcessing && (
                  <Button
                    disabled
                    onPress={() => null}
                    className="text-lg py-1"
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
                    onPress={validateInput}
                    className="text-lg py-1"
                    style={{ borderRadius: 15 }}
                    labelStyle={{ fontSize: 16 }}
                    mode="contained"
                  >
                    Continue
                  </Button>
                )}

                <View className="flex-row items-center justify-center pt-3 pb-3">
                  <Text>I Remember my password</Text>
                  <Button
                    disabled={showProcessing}
                    onPress={() => router.back()}
                  >
                    Login
                  </Button>
                </View>
              </View>
            </View>
          )}
          {otpSended && !otpVerified && (
            <EaseView className="gap-y-7 mb-3 ">
              <View className="px-5 ml-5">
                <Text className="font-bold">Enter OTP Blow</Text>
              </View>
              <View className="px-10 mt-7">
                <OtpInput onChange={setOtp} length={4} height={50} width={50} />
              </View>
              <View className="px-10 mt-7">
                <Button
                  onPress={verifyOtp}
                  disabled={otp.length == 4 ? false : true}
                  className="text-lg py-1"
                  style={{ borderRadius: 15 }}
                  labelStyle={{ fontSize: 16 }}
                  mode="contained"
                >
                  Continue
                </Button>
              </View>
              <View className="items-center w-full mt-7">
                <View
                  style={{ borderColor: theme.colors.primary }}
                  className="flex-row rounded items-center justify-center border border-dotted w-[50%]"
                >
                  <Button
                    className=""
                    disabled={resendCount <= 0 ? false : true}
                    onPress={handleResend}
                  >
                    Resend OTP
                  </Button>
                  {resendCount <= 0 ? "" : <Text>in {resendCount}s</Text>}
                </View>
              </View>
            </EaseView>
          )}

          {/* Change Password Fields */}

          {otpSended && otpVerified && (
            <View className="px-7 gap-y-5">
              <TextInput
                placeholder="Password"
                onChangeText={setNewPassword}
                secureTextEntry={showPassword ? false : true}
                left={<TextInput.Icon size={20} icon="lock" />}
                disabled={showProcessing}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
                style={{ backgroundColor: "transparent" }}
                right={
                  <TextInput.Icon
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? "eye-off" : "eye"}
                  />
                }
              />
              <TextInput
                placeholder="Confirm Password"
                onChangeText={setNewPassword2}
                secureTextEntry={showPassword ? false : true}
                left={<TextInput.Icon size={20} icon="lock" />}
                disabled={showProcessing}
                mode="outlined"
                outlineStyle={{ borderRadius: 15 }}
                style={{ backgroundColor: "transparent" }}
                right={
                  <TextInput.Icon
                    size={20}
                    onPress={() => setShowPassword(!showPassword2)}
                    icon={showPassword2 ? "eye-off" : "eye"}
                  />
                }
              />
              <View>
                {showProcessing && (
                  <Button
                    disabled
                    onPress={() => null}
                    className="text-lg py-1"
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
                    onPress={handleChangePassword}
                    className="text-lg py-1"
                    style={{ borderRadius: 15 }}
                    labelStyle={{ fontSize: 16 }}
                    mode="contained"
                  >
                    Continue
                  </Button>
                )}
              </View>
            </View>
          )}
        </View>
      </BottomLayout>
      <NetworkRequestErrorSheet
        visible={networkErrorSheetVisible}
        onDismiss={setNetworkErrorSheetVisible}
      />

      <Processing visible={resendOtpProcessing} />
      <Portal>
        <Dialog
          visible={exitDialogVisible}
          onDismiss={() => setExitDialogVisible(false)}
        >
          <Dialog.Title>Go Back</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure do you want to leave this screen</Text>
          </Dialog.Content>
          <Dialog.Actions className="">
            <Button
              buttonColor="#f41c1c6b"
              textColor={theme.colors.onBackground}
              className="w-20"
              onPress={() => {
                setExitDialogVisible(false);
                router.back();
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

export default PasswordReset;
