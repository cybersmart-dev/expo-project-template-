import SingupPasswordSetup from "@/components/login/SingupPasswordSetup";
import { PaperSafeView, PaperView } from "@/components/PaperView";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";

const Singup = () => {
  const theme = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  

  const validateInputs = () => {
    Keyboard.dismiss()
    if (!fullName || !email || !phoneNumber || !state) {

      showMessage({
        message: "Required fields is missing",
        description: "All fields are required",
        type: "danger",
      });
      return;
    }

    router.push({
      pathname: "/logins/setupPassword", params: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        state:state
    } });

    return;
  };

  return (
    <PaperSafeView>
      <Appbar>
        <Appbar.Content
          title={
            <View>
              <Text className="text-lg font-thin">Singup</Text>
            </View>
          }
          mode="small"
          style={{ alignItems: "flex-start" }}
        />
      </Appbar>
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
            Welcome To AppName
          </Text>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontSize: 13,
              marginBottom: 30,
              opacity: 0.5,
            }}
          >
            App description here
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "android" ? "padding" : "height"}
        className="h-auto pt-7 w-screen justify-center rounded-t-[20px]"
        style={{
          position: "absolute",
          bottom: 0,
          marginTop: 10,
          paddingBottom: 30,
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <View className="space-y-7 px-7 shadow-2xl">
          <TextInput
            label="Full Name"
            keyboardType={"default"}
            className="bg-transparent"
            onChangeText={setFullName}
            left={<TextInput.Icon size={20} icon="account" />}
          />

          <TextInput
            label="Email Address"
            keyboardType={"email-address"}
            className="bg-transparent"
            onChangeText={setEmail}
            left={<TextInput.Icon size={20} icon="email" />}
          />

          <TextInput
            label="Phone Number"
            keyboardType={"numeric"}
            className="bg-transparent"
            onChangeText={setPhoneNumber}
            left={<TextInput.Icon size={20} icon="phone" />}
          />

          <TextInput
            label="State"
            keyboardType={"default"}
            className="bg-transparent"
            onChangeText={setState}
            left={<TextInput.Icon size={20} icon="home" />}
          />

          <Button onPress={validateInputs} mode="contained">
            Next
          </Button>
          <View className="flex-row items-center justify-center pb-5">
            <Text>I have an account</Text>
            <Button onPress={() => router.back()}>Sing in</Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      <FlashMessage position={"top"} />
    </PaperSafeView>
  );
};

export default Singup;
