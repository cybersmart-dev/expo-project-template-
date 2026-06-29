import {
  View,
  Text,
  GestureResponderEvent,
  OpaqueColorValue,
  Animated,
  ColorValue,
} from "react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Button as RNFButton,
  useTheme,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface ButtonProps {
  children?: React.ReactNode;
  loading?: boolean;
  icon?: IconSource | undefined
  onPress?: ((e: GestureResponderEvent) => void) | undefined;
  fontSize?: number | undefined
  backgroundColor?:
    | string
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | OpaqueColorValue
    | undefined;
  textColor?: ColorValue | undefined;
  disabled?: boolean | undefined
  mode?:
    | "text"
    | "contained"
    | "outlined"
    | "elevated"
    | "contained-tonal"
    | undefined;
}
const Button = ({
  children,
  loading,
  onPress,
  textColor,
  backgroundColor,
  disabled,
  fontSize = 16,
  icon,
  mode = "contained",
}: ButtonProps) => {
  const theme = useTheme();

  const getBackgroundColor = useCallback(() => {
    if (backgroundColor && mode == "contained") {
      return backgroundColor;
    }
    if (!backgroundColor && mode == "contained") {
      return theme.colors.primary
    }
    return undefined;
  }, []);

  const getTextColor = useCallback(() => {
    if (textColor && mode == "contained") {
      return textColor
    }
    if (!textColor && mode == "contained") {
      return theme.colors.background
    }
    return undefined
  }, []);

  return (
    <View className="">
      {loading && (
        <RNFButton
          disabled
          className="text-lg py-1 flex-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="contained"
        >
          <View className="flex-row">
            <Text> </Text>
            <ActivityIndicator size={25} />
          </View>
        </RNFButton>
      )}

      {!loading && (
        <RNFButton
          onPress={onPress}
          disabled={disabled}
          mode={mode}
          className="py-1"
          icon={icon}
          style={{
            borderRadius: 15,
            backgroundColor: !disabled ? getBackgroundColor() : theme.colors.surfaceDisabled,
          }}
          labelStyle={{
            fontSize: fontSize,
            color:getTextColor()
          }}
        >
          {children}
        </RNFButton>
      )}
    </View>
  );
};

export default Button;
