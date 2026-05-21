import {
  View,
  Text,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import React, { useCallback, useState } from "react";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import Entypo from "@expo/vector-icons/Entypo";
import { EaseView } from "react-native-ease";
import { IconButton, useTheme } from "react-native-paper";
import { useFocusEffect } from "expo-router";

interface BottomLayoutProps {
  children: React.ReactNode;
   onLayout?: ((event: LayoutChangeEvent) => void) | undefined
}

const BottomLayout = ({ children, onLayout }: BottomLayoutProps) => {
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
      className="h-auto min-h-[40%]  w-screen "
      style={{
        position: "absolute",
        bottom: 0,
      }}
    >
      <EaseView
       onLayout={onLayout}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          marginTop: 50,
          paddingBottom: 30,
          
        }}
        className="rounded-t-[30px] h-full justify-center"
        animate={{ translateY: loaded ? 0 : 100 }}
        transition={{ type: "timing", duration: 500, easing: "linear" }}
      >
        <View   className="space-y-7 px-0 shadow-2xl">{children}</View>
      </EaseView>
    </KeyboardAvoidingView>
  );
};

export default BottomLayout;
