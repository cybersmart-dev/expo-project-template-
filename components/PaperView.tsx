import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { EaseView } from "react-native-ease";
import { LinearGradient } from "expo-linear-gradient";

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

interface PaperSafeViewProps extends SafeAreaViewProps {
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
      edges={["bottom"]}
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
        <LinearGradient
          className="flex-1"
          style={{paddingTop: RNStatusBar.currentHeight}}
          colors={[theme.colors.secondaryContainer, theme.colors.background ]}
        >
          <Pressable onPress={onPress} className={className || "flex-1"}>
            {children}
          </Pressable>
        </LinearGradient>
      </EaseView>
    </SafeAreaView>
  );
};
