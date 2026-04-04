import SingupPasswordSetup from "@/components/login/SingupPasswordSetup";
import { PaperSafeView, PaperView } from "@/components/PaperView";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutChangeEvent,
} from "react-native";
import { EaseView } from "react-native-ease";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";

const Singup = () => {
  const theme = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [formHeight, setFormHeight] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const validateInputs = () => {
    Keyboard.dismiss();
    if (!fullName || !email || !phoneNumber || !state) {
      showMessage({
        message: "Required fields is missing",
        description: "All fields are required",
        type: "danger",
      });
      return;
    }

    router.push({
      pathname: "/logins/setupPassword",
      params: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        state: state,
      },
    });

    return;
  };

  const handleOnLayout = (event: LayoutChangeEvent): void => {
    const height = event.nativeEvent.layout.height;
    setFormHeight(height);
  };

  return (
    <PaperSafeView>
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
        <Appbar.Content
          title={<View></View>}
          mode="small"
          style={{ alignItems: "flex-start" }}
        />

        <EaseView
          animate={{ translateX: loaded ? 0 : 200 }}
          transition={{ type: "timing", duration: 1000 }}
        >
          <Button mode={"contained-tonal"} className="mr-2">
            Help
          </Button>
        </EaseView>
      </Appbar>
      <View
        style={{ bottom: 0, marginBottom: formHeight }}
        className="absolute space-y-1 w-full items-center justify-center"
      >
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 1000, type: "timing" }}
        >
          <Image
            className="h-[100px] w-[150px]  rounded-full"
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
              Welcome To AppName
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
        className="h-auto pt-7 w-screen justify-center rounded-t-[20px]"
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <EaseView
          onLayout={handleOnLayout}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginTop: 50,
            paddingBottom: 30,
            boxShadow: theme.dark ? undefined : CustomLightTheme.boxShadow
          }}
          className="rounded-t-[30px] h-full justify-center "
          animate={{ translateY: loaded ? 0 : 100 }}
          transition={{ type: "timing", duration: 500, easing: "linear" }}
        >
          <View className="space-y-7 px-7 shadow-2xl">
            <TextInput
              placeholder="Full Name"
              keyboardType={"default"}
              className="bg-transparent"
              onChangeText={setFullName}
              left={<TextInput.Icon size={20} icon="account" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />

            <TextInput
              placeholder="Email Address"
              keyboardType={"email-address"}
              className="bg-transparent"
              onChangeText={setEmail}
              left={<TextInput.Icon size={20} icon="email" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />

            <TextInput
              placeholder="Phone Number"
              keyboardType={"numeric"}
              className="bg-transparent"
              onChangeText={setPhoneNumber}
              left={<TextInput.Icon size={20} icon="phone" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />

            <TextInput
              placeholder="State"
              keyboardType={"default"}
              className="bg-transparent"
              onChangeText={setState}
              left={<TextInput.Icon size={20} icon="home" />}
              mode="outlined"
              outlineStyle={{ borderRadius: 15 }}
            />

            <View className="mb-0">
              <Button
                onPress={validateInputs}
                mode="contained"
                className="text-lg p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
              >
                Next
              </Button>
              <View className="flex-row items-center justify-center pt-1">
                <Text>I have an account</Text>
                <Button onPress={() => router.back()}>Sing in</Button>
              </View>
            </View>
          </View>
        </EaseView>
      </KeyboardAvoidingView>

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default Singup;
