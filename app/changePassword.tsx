import { Keyboard, View } from "react-native";
import React, { use, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import CustomAppbar from "@/components/CustomAppbar";
import { Appbar, IconButton, Text, useTheme } from "react-native-paper";
import BottomLayout from "@/components/Containers/BottomLayout";
import { router, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TextInput from "@/components/Inputs/TextInput";
import Button from "@/components/Buttons/Button";
import { Timer } from "@/constants/Utils";
import { Image } from "expo-image";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";

const changePassword = () => {
  const theme = useTheme();
  const [processing, setProcessing] = useState(false);
  const { realPassword } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [passwordError, setpasswordError] = useState(false);
  const [password2Error, setpassword2Error] = useState(false);

  const [passwordErrorMessage, setpasswordErrorMessage] = useState("");
  const [password2ErrorMessage, setpassword2ErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);

  const validateInputs = async () => {
    if (password.trim().length < 6) {
      setpasswordError(true);
      setpasswordErrorMessage("Password most be 6 characters or higher");
      return;
    }

    if (password.trim() != password2.trim()) {
      setpasswordError(false);
      setpasswordErrorMessage("");

      setpassword2Error(true);
      setpassword2ErrorMessage("All two passwords most be match");
      return;
    }

    setpassword2Error(false);
    setpassword2ErrorMessage("");
    changePasswordRequest();
  };

  const changePasswordRequest = async () => {
    setProcessing(true);
    const response = await requests.post({
      url: "/auth/change-password/create/",
      data: { password: realPassword, new_password: password },
    });
    setProcessing(false);

    if (response.status == 1) {
      Toast.success({ title: response.message });
      router.back()
    }

    if (response.status == 0) {
      await Toast.dangerHapticsAsync({ title: response.message });
    }

    if (response.status == undefined) {
      await Toast.dangerHapticsAsync({ title: response.message });
    }
  };

  useEffect(() => {
    setpasswordError(false);
  }, [password]);

  useEffect(() => {
    setpassword2Error(false);
  }, [password2]);

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
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
          title={<Text className="text-lg font-bold">Change Password</Text>}
        />
      </CustomAppbar>
      <View className="px-5 mt-10">
        <View className="w-full items-center">
          <Image
            className="h-28 w-24"
            style={{ height: 80, width: 80 }}
            contentFit="cover"
            transition={1000}
            source={require("@/assets/images/gif/password_setup_anim_lock.webp")}
          />
        </View>
        <Text
          style={{ textAlign: "center" }}
          className="text-lg text-center font-light w-full"
        >
          Create new password
        </Text>
        <Text className="hidden text-center font-light">🔒</Text>
      </View>

      <View className="flex-1">
        <BottomLayout>
          <View className="mt-7 px-5 gap-y-2">
            <TextInput
              placeholder="Password"
              error={passwordError}
              secureTextEntry={showPassword}
              errorMessage={passwordErrorMessage}
              onChangeText={setPassword}
              right={() => (
                <IconButton
                  onPress={() => setShowPassword(!showPassword)}
                  icon={showPassword ? "eye-off" : "eye"}
                />
              )}
            />
            <TextInput
              placeholder="Confirm Password"
              error={password2Error}
              secureTextEntry={showPassword2}
              errorMessage={password2ErrorMessage}
              onChangeText={setPassword2}
              right={() => (
                <IconButton
                  onPress={() => setShowPassword2(!showPassword2)}
                  icon={showPassword2 ? "eye-off" : "eye"}
                />
              )}
            />

            <Button loading={processing} onPress={validateInputs}>
              Continue
            </Button>
          </View>
        </BottomLayout>
      </View>
    </PaperSafeView>
  );
};

export default changePassword;
