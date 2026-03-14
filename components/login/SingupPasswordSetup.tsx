import { Keyboard, View } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "../PaperView";
import OtpInput from "../Inputs/OtpInput";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

interface SingupPasswordSetupProps {
  onComfirm: (data: { pass1: string; pass2: string }) => void;
}
export default function SingupPasswordSetup({
  onComfirm,
}: SingupPasswordSetupProps) {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleComfirm = () => {
    onComfirm({
      pass1: password,
      pass2: password2,
    });
  };

  const comfirmDisabled = (): boolean | undefined => {
    if (password.trim() == "" && password2.trim() == "") {
      return true;
    }
    if (
      password.length >= 6 &&
      password2.length >= 6 &&
      password == password2
    ) {
      return false;
    }
    return true;
  };
  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <FlashMessage position={"top"} />
      <Appbar style={{backgroundColor: theme.colors.primary}}>
        <Appbar.Action isLeading color="white" icon={"close"} onPress={() => router.back()} />
        <Appbar.Content color="white" title="Singup" mode="small" />
      </Appbar>

      <View className="space-y-10 mt-7 px-5">
        <View className="px-5">
          <Text className="text-lg  font-bold ">Setup Password</Text>
          <View className=" mt-5 space-y-2">
            <Text className="">1: Password lenght Most be 6 or high</Text>
            <Text className="">2: All those fields most be match</Text>
          </View>
        </View>

        <TextInput
          label="Enter Password"
          className="bg-transparent"
          autoFocus
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
        <TextInput
          label="Comfirm Password"
          className="bg-transparent"
          left={<TextInput.Icon size={20} icon="lock" />}
          secureTextEntry={showPassword2 ? false : true}
          onChangeText={setPassword2}
          right={
            <TextInput.Icon
              size={20}
              onPress={() => setShowPassword2(!showPassword2)}
              icon={showPassword2 ? "eye-off" : "eye"}
            />
          }
        />
      </View>

     

      <View className="px-8">
        <Button
          disabled={comfirmDisabled()}
          className="mt-7"
          onPress={handleComfirm}
          mode="contained"
        >
          SingUp Now
        </Button>
      </View>
       <StatusBar backgroundColor={theme.colors.primary} style="light" />
    </PaperSafeView>
  );
}
