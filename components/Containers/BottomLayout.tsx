import {
  View,
  KeyboardAvoidingView,
  Platform,
  LayoutChangeEvent,
  Dimensions
} from "react-native";
import React, { useCallback, useState } from "react";
import { EaseView } from "react-native-ease";
import { useTheme } from "react-native-paper";
import { useFocusEffect } from "expo-router";


const { width, height } = Dimensions.get("screen")

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
      className="h-auto min-h-[40%]  w-screen  justify-center flex-row"
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
          borderTopRightRadius: 30,
          borderTopLeftRadius:30,
          width: width
          
        }}
        className="rounded-t-5 h-full w-screen justify-center"
        animate={{ translateY: loaded ? 0 : 100 }}
        transition={{ type: "timing", duration: 500, easing: "linear" }}
      >
        <View >{children}</View>
      </EaseView>
    </KeyboardAvoidingView>
  );
};

export default BottomLayout;
