import {
  View,
  Pressable,
  GestureResponderEvent,
  DimensionValue,
} from "react-native";
import React from "react";
import ActionButton from "./ActionButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface LargeActionButtonProps {
  icon: IconSource;
  label?: string;
  description?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  width?: DimensionValue | undefined;
}
const LargeActionButton = ({
  icon,
  label,
  description,
  onPress,
  width,
}: LargeActionButtonProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.background,
        width: width,
        maxWidth: 120,
      }}
      className="p-2 py-4 rounded-2xl px-3"
    >
      <View className="flex-row gap-x-3">
        <ActionButton icon={icon} onPress={onPress} />
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={theme.colors.onBackground}
        />
      </View>
      {description && (
        <Text style={{ fontSize: 11 }} className="opacity-50">
          {description}
        </Text>
      )}
      <Text className="text-lg">{label}</Text>
    </Pressable>
  );
};

export default LargeActionButton;
