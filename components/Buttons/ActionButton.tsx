import React from "react";
import { View, StyleSheet, TouchableOpacity, Pressable, GestureResponderEvent } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export interface ActionButtonProps {
  icon: IconSource;
  label?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}
const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
  const theme = useTheme();

  const getColor = () => {
    if (theme.dark) {
      return theme.colors.onBackground
    }
    return theme.colors.surfaceVariant
  }

  const getIconColor = () => {
    if (theme.dark) {
      return theme.colors.surface
    }
    return theme.colors.onBackground
  }
  return (
    <View className="space-y-1 justify-center items-center w-auto">
      <TouchableOpacity onPress={onPress}>
        <Avatar.Icon
          size={45}
          style={{ backgroundColor: getColor() }}
          color={getIconColor()}
          icon={icon}
        />
      </TouchableOpacity>
      <Text numberOfLines={1}>{label}</Text>
    </View>
  );
};

export default ActionButton;
