import { Timer } from "@/constants/Utils";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface ActionButtonProps {
  icon: IconSource;
  label?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}
const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
  const theme = useTheme();
   const [loaded, setLoaded] = useState(false);
    const bounce = useSharedValue(0);
  
    useFocusEffect(
      useCallback(() => {
        bounceBuuton()
        setLoaded(true);
  
        return () => {
          setLoaded(false);
        };
      }, []),
    );
  const getColor = () => {
    if (theme.dark) {
      return theme.colors.onBackground;
    }
    return theme.colors.surfaceVariant;
  };

  const bounceBuuton = async () => {
    bounce.value = 1.3;
    await new Timer().postDelayedAsync({ sec: 300 });
    bounce.value = 1;
  };

  const getIconColor = () => {
    if (theme.dark) {
      return theme.colors.surface;
    }
    return theme.colors.onBackground;
  };
  const actionButtonAnimetedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(bounce.value, { damping: 50 }) },
        { translateY: bounce.value },
      ],
    };
  });
  return (
    <Animated.View style={[actionButtonAnimetedStyle]} className="space-y-1 justify-center items-center w-auto">
      <TouchableOpacity onPress={onPress}>
        <Avatar.Icon
          size={45}
          style={{ backgroundColor: getColor() }}
          color={getIconColor()}
          icon={icon}
        />
      </TouchableOpacity>
      <Text numberOfLines={1}>{label}</Text>
    </Animated.View>
  );
};

export default ActionButton;
