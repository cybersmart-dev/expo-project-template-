import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { Card, useTheme } from "react-native-paper";
import { EaseView } from "react-native-ease";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Timer } from "@/constants/Utils";

export const HomeQuickActionsContainer = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const bounce = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      animateBuuton();
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const animateBuuton = async () => {
    bounce.value = 1.3;
    await new Timer().postDelayedAsync({ sec: 300 });
    bounce.value = 1;
  };

  const actionButtonAnimetedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(bounce.value, { damping: 50 }) },
        { translateY: bounce.value },
      ],
    };
  });

  const goToBuyData = useCallback(() => {
    router.push("/buy-data");
  }, []);

  const goToBuyAirtime = useCallback(() => {
    router.push("/buy-airtime");
  }, []);

  const goToSellAirtime = useCallback(() => {
    router.push("/airtime2cash/airtime2cash");
  }, []);

  const SignalIcon = React.memo(({ color }) => (
    <FontAwesome name="signal" size={24} color={color} />
  ));

  const MobileIcon = React.memo(({ color }) => (
    <FontAwesome name="mobile" size={24} color={color} />
  ));

  const CashIcon = React.memo(({ color }) => (
    <Ionicons name="cash-outline" size={24} color={color} />
  ));

  return (
    <View className="px-7">
      <View className="flex-row items-center justify-between  p-2">
        <ActionButton
          label="Data"
          onPress={goToBuyData}
          icon={({ color }) => <SignalIcon color={color} />}
        />

        <ActionButton
          label="Airtime"
          onPress={goToBuyAirtime}
          icon={({ color }) => <MobileIcon color={color} />}
        />

        <ActionButton
          label="Sell Airtime"
          onPress={goToSellAirtime}
          icon={({ color }) => <CashIcon color={color} />}
        />
      </View>
    </View>
  );
};
