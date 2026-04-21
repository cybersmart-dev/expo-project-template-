import {
  View,
  Text,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import Entypo from "@expo/vector-icons/Entypo";
import { EaseView } from "react-native-ease";
import { useTheme } from "react-native-paper";
import { useFocusEffect } from "expo-router";

interface BottomLayoutProps {
  children: React.ReactNode;
}

const BottomLayout = ({ children }: BottomLayoutProps) => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "android" ? "padding" : "height"}
      className="h-auto min-h-[40%]  w-screen"
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
          boxShadow: theme.dark ? undefined : CustomLightTheme.boxShadow,
        }}
        className="rounded-t-[30px] h-full justify-center "
        animate={{ translateY: loaded ? 0 : 100 }}
        transition={{ type: "timing", duration: 500, easing: "linear" }}
      >
        <View className="space-y-7 px-7 shadow-2xl">{children}</View>
      </EaseView>
    </KeyboardAvoidingView>
  );
};

export default BottomLayout;
