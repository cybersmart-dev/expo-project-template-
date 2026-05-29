import { Keyboard, View } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "../PaperView";
import OtpInput from "../Inputs/OtpInput";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import CustomAppbar from "../CustomAppbar";

interface SingupPasswordSetupProps {
  onComfirm: (data: { pass1: string; pass2: string }) => void;
}
export default function SingupPasswordSetup({
  onComfirm,
}: SingupPasswordSetupProps) {
  const theme = useTheme();
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
     
      <CustomAppbar>
        <Appbar.Action
          isLeading
          icon={({ color, size }) => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={size}
              color={color}
            />
          )}
          onPress={() => router.back()}
        />
        <Appbar.Content title="" mode="small" />
      </CustomAppbar>

      <View className="gap-y-10 mt-7 px-8">
        <View className="px-5">
          <View className="w-full items-center">
            <Image
              className="h-28 w-24"
              style={{height: 80, width: 80}}
              contentFit="cover"
              transition={1000}
              source={require("@/assets/images/gif/password_setup_anim_lock.webp")}
            />
          </View>
          <Text className="text-2xl text-center font-light w-full">
            Create Password
          </Text>
          <Text className="hidden text-center font-light">🔒</Text>
        </View>

        <TextInput
          placeholder="Enter Password"
          style={{ backgroundColor: "transparent" }}
          autoFocus
          secureTextEntry={showPassword ? false : true}
          left={<TextInput.Icon size={20} icon="lock-outline" />}
          onChangeText={setPassword}
          mode="outlined"
          outlineStyle={{ borderRadius: 15 }}
          right={
            <TextInput.Icon
              size={20}
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? "eye-off-outline" : "eye-outline"}
            />
          }
        />
        <TextInput
          placeholder="Comfirm Password"
          style={{ backgroundColor: "transparent" }}
          left={<TextInput.Icon size={20} icon="lock-check-outline" />}
          secureTextEntry={showPassword2 ? false : true}
          onChangeText={setPassword2}
          mode="outlined"
          outlineStyle={{ borderRadius: 15 }}
          right={
            <TextInput.Icon
              size={20}
              onPress={() => setShowPassword2(!showPassword2)}
              icon={showPassword2 ? "eye-off-outline" : "eye-outline"}
            />
          }
        />
      </View>

      <View className="px-8 py-5">
        <Button
          disabled={comfirmDisabled()}
          onPress={handleComfirm}
          className="text-lg py-1 mt-7"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="contained"
        >
          SingUp Now
        </Button>
      </View>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
}
