import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export interface ActionButtonProps {
  icon: IconSource
  label?: string,
  onPress?: () => void
}
const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
  const theme = useTheme()
  return (
    <View className="space-y-1 justify-center items-center w-auto">
      <TouchableOpacity onPress={onPress}>
        <Avatar.Icon size={45} style={{backgroundColor: theme.colors.primaryContainer}} color="black" icon={icon} />
      </TouchableOpacity>
      <Text numberOfLines={1}>{ label }</Text>
    </View>
  );
};

export default ActionButton;
