import Processing from "../models/Processing";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { PaperSafeView } from "../PaperView";

const EmailLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const processingRef = useRef<number>(null);

  const validateInput = () => {
    if (!email) {
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

  const login = () => {
    setShowProcessing(true);
    processingRef.current = setInterval(() => {
      setShowProcessing(false);

      if (processingRef.current) {
        clearInterval(processingRef.current);
        processingRef.current = null;
        showMessage({
          message: "Login",
          description: "Login successfuly",
          type: "success",
        });
        router.push("/(tabs)");
      }
    }, 3000);
  };
  return (
    <PaperSafeView
      onPress={() => Keyboard.dismiss()}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="absolute top-[120px] space-y-5 w-full items-center justify-center">
        <Image
          className="h-14 w-14  rounded-full"
          source={require("@/assets/images/profile_avatar.png")}
        />
        <View className="items-center">
          <Text
            style={{
              color: theme.colors.onBackground,
              fontSize: 20,
            }}
          >
            Login With Email Address
          </Text>
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
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        className="h-auto pt-10 w-screen justify-center rounded-t-[30px]"
        style={{
          position: "absolute",
          bottom: 0,
          marginTop: 10,

          paddingBottom: 30,
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <View className="space-y-5 px-7 shadow-2xl">
          <TextInput
            label="Email Address"
            keyboardType={"email-address"}
            className="bg-transparent"
            onChangeText={setEmail}
            left={<TextInput.Icon size={20} icon="email" />}
          />
          <TextInput
            label="Password"
            onChangeText={setPassword}
            secureTextEntry={showPassword ? false : true}
            left={<TextInput.Icon size={20} icon="lock" />}
            className="bg-transparent"
            right={
              <TextInput.Icon
                size={20}
                onPress={() => setShowPassword(!showPassword)}
                icon={showPassword ? "eye-off" : "eye"}
              />
            }
          />
          <View className="pt-5">
            <Button
              onPress={() => validateInput()}
              className=""
              mode="contained"
            >
              Login
            </Button>
          </View>
          <View className="flex-row items-center justify-center pt-5 pb-7">
            <Text>I Don't have an account</Text>
            <Button onPress={() => router.push("/singup")}>Sing up</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Processing visible={showProcessing} />
    </PaperSafeView>
  );
};

export default EmailLoginComponent;
