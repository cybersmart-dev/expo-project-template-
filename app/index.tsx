import React, { useState } from "react";
import { View, StyleSheet, Image, Modal, ImageBackground } from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import PhoneLoginComponent from "@/components/login/PhoneLoginComponent";
import EmailLoginComponent from "@/components/login/EmailLoginComponent";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";

const Index = () => {
  const theme = useTheme();
  const [loginOption, setLoginOption] = useState("");

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Appbar style={{ backgroundColor: "transparent" }}>
        <Appbar.Content
          title={
            <View>
              <Text className="text-lg font-thin text-white">Singin</Text>
            </View>
          }
          mode="small"
          style={{ alignItems: "flex-start" }}
        />
        <Button>Help</Button>
      </Appbar>
      <View className="absolute top-[120px] space-y-5 w-full items-center justify-center">
        <Image
          className="h-14 w-14  rounded-full"
          source={require("../assets/images/profile_avatar.png")}
        />
        <View className="items-center">
          <Text
            style={{
              fontSize: 20,
            }}
          >
            Welcome To AppName
          </Text>
          <Text
            style={{
              fontSize: 13,
              marginBottom: 30,
              opacity: 0.5,
            }}
          >
            App description here
          </Text>
        </View>
      </View>
      <View
        className="h-[50%] w-screen justify-center rounded-t-[40px]"
        style={{
          position: "absolute",
          bottom: 0,
          marginTop: 10,
          paddingBottom: 30,
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <View className="space-y-5 px-7 shadow-2xl">
          <Button
            onPress={() => router.push("/logins/emailLogin")}
            icon="account"
            mode="contained"
          >
            Login With Email
          </Button>
          <Button
            onPress={() => router.push("/logins/phoneLogin")}
            className=""
            icon="phone"
            mode="contained"
          >
            Login with phone
          </Button>
          <Button
            onPress={() =>
              showMessage({
                message: "Login",
                description:
                  "Social login not avilable. login with email instead",
                type: "info",
                icon: "info",
              })
            }
            mode="contained"
            icon="google"
          >
            Login With Google
          </Button>
          <View className="flex-row items-center justify-center bg-[#ff000000]">
            <Text className="">I Don't have an account</Text>
            <Button onPress={() => router.push("/singup")}>Sing up</Button>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setLoginOption("")}
        visible={loginOption ? true : false}
      >
        {loginOption == "Email" && <EmailLoginComponent />}
        {loginOption == "Phone" && <PhoneLoginComponent />}
      </Modal>
    </SafeAreaView>
  );
};

export default Index;
