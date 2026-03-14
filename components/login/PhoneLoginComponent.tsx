import React, { useRef, useState } from "react";
import {
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { PaperSafeView } from "../PaperView";
import Processing from "../models/Processing";

const PhoneLoginComponent = () => {
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const processingRef = useRef<number>(null);

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
      <FlashMessage />

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
            Login with phone number
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
        className="h-auto pt-7 w-screen justify-center rounded-t-[30px]"
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
            label="Phone Number"
            keyboardType={"number-pad"}
            className="bg-transparent"
            onChangeText={setPhone}
            left={<TextInput.Icon size={20} icon="phone" />}
          />
          <TextInput
            label="Password"
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

export default PhoneLoginComponent;
