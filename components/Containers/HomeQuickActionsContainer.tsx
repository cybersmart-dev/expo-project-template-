import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { Card, useTheme } from "react-native-paper";
import { EaseView } from "react-native-ease";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Timer } from "@/constants/Utils";

export const HomeQuickActionsContainer = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const bounce = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      animateBuuton()
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const animateBuuton = async () => {
      bounce.value = 1.3
      await new Timer().postDelayedAsync({ sec: 300 })
      bounce.value = 1
      
    }

   const actionButtonAnimetedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: withSpring(bounce.value, { damping: 50 }) },
          { translateY: bounce.value },
        ],
      };
    });
  return (
    <Card>
      <View className="flex-row items-center justify-around p-2">
        <Animated.View  >
          <ActionButton
            label="  Data  "
            onPress={() => router.push("/buy-data")}
            icon={({ color, size }) => (
              <FontAwesome name="signal" size={24} color={color} />
            )}
          />
        </Animated.View>
        <Animated.View style={[actionButtonAnimetedStyle]}>
          <ActionButton
            label="Airtime"
            onPress={() => router.push("/buy-airtime")}
            icon={({ color }) => (
              <FontAwesome name="mobile" size={24} color={color} />
            )}
          />
        </Animated.View>

        <Animated.View style={[actionButtonAnimetedStyle]}>
          <ActionButton
            icon={({ color }) => (
              <Ionicons name="cash-outline" size={24} color={color} />
            )}
            onPress={() => router.push("/airtime2cash/airtime2cash")}
            label="Sell Airtime"
          />
        </Animated.View>
      </View>
    </Card>
  );
};
