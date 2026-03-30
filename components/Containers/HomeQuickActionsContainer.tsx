import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { Card, useTheme } from "react-native-paper";
import { EaseView } from "react-native-ease";

export const HomeQuickActionsContainer = () => {
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
    <Card>
      <View className="flex-row items-center justify-around p-2">
        <EaseView
          animate={{ scale: loaded ? 1 : 0 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <ActionButton
            label="  Data  "
            onPress={() => router.push("/buy-data")}
            icon={({ color, size }) => (
              <FontAwesome name="signal" size={24} color={color} />
            )}
          />
        </EaseView>
        <EaseView
          animate={{ scale: loaded ? 1 : 0 }}
          transition={{ type: "timing", duration: 800, delay: 200 }}
        >
          <ActionButton
            label="Airtime"
            onPress={() => router.push("/buy-airtime")}
            icon={({ color }) => (
              <FontAwesome name="mobile" size={24} color={color} />
            )}
          />
        </EaseView>

        <EaseView
          animate={{ scale: loaded ? 1 : 0 }}
          transition={{ type: "timing", duration: 800, delay: 400 }}
        >
          <ActionButton
            icon={({ color }) => (
              <Ionicons name="cash-outline" size={24} color={color} />
            )}
            onPress={() => router.push("/airtime2cash/airtime2cash")}
            label="Sell Airtime"
          />
        </EaseView>
      </View>
    </Card>
  );
};
