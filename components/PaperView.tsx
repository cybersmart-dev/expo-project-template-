import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { EaseView } from "react-native-ease";

interface PaperViewProps {
  children: React.ReactNode;
}
export const PaperView: React.FC<PaperViewProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface PaperSafeViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const PaperSafeView: React.FC<PaperSafeViewProps> = ({
  children,
  className,
  style,
  onPress,
}) => {
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
    <SafeAreaView
      className="flex-1"
      style={[{ backgroundColor: theme.colors.background }, style]}
    >
      <EaseView
        animate={{
          translateY: loaded ? 0 : 90,
          scaleX: loaded ? 1 : 0.7,
          opacity: loaded ? 1 : 0,
        }}
        transition={{ type: "timing", duration: 700, easing: "linear" }}
        className="flex-1"
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS == "android" ? "padding" : "height"}
        >
          <Pressable onPress={onPress} className={className || "flex-1"}>
            {children}
          </Pressable>
        </KeyboardAvoidingView>
      </EaseView>
    </SafeAreaView>
  );
};
