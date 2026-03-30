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

const PhoneLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const processingRef = useRef<number>(null);

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
    Keyboard.dismiss()

    await new Timer().postDelayedAsync({ sec: 3000 });

    setShowProcessing(false);
    showMessage({
      message: "Login",
      description: "Login successfuly",
      type: "success",
    });
    router.push("/(tabs)");
  };
  return (
    <PaperSafeView
      onPress={() => Keyboard.dismiss()}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar>
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
            source={require("@/assets/images/profile_avatar.png")}
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
              left={<TextInput.Icon size={20} icon="phone" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />
            <View>
              <TextInput
                placeholder="Password"
                className="bg-transparent"
                secureTextEntry={showPassword ? false : true}
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
                <Button mode="text" className="">
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
                <Button onPress={() => router.push("/singup")}>Sing up</Button>
              </View>
            </View>
          </View>
        </EaseView>
      </KeyboardAvoidingView>
      <Processing visible={false} />
      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default PhoneLoginComponent;
