import { formatNumber } from "@/constants/Formats";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { ColorValue, Pressable, useColorScheme, View } from "react-native";
import { EaseView } from "react-native-ease";
import { Button, Icon, IconButton, Text, useTheme } from "react-native-paper";

interface BalanceContainerProps {
  user?: Object;
  theme?: any;
  hideBalance?: boolean;
  userInfo?: any;
  fetchingInfo: boolean
  onHideBalanceToggle?: () => void;
  fetchInfo: () => void

}
const BalanceContainer = ({
  user,
  hideBalance,
  onHideBalanceToggle,
  userInfo,
  fetchingInfo,
  fetchInfo
}: BalanceContainerProps) => {
  const timerRef = useRef(0);
  const colorScheme = useColorScheme();
  const theme = useTheme()
 
  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, theme.colors.primaryContainer]
    }
    return [theme.colors.primary, theme.colors.primary]
  }

  return (
    <LinearGradient
      colors={getColors()}
      style={{
        backgroundColor:
          theme.dark
            ? theme.colors.primaryContainer
            : theme.colors.primary,
      }}
      className="relative h-[190px] w-full rounded-b-lg mt-0  p-4"
    >
      <View>
        <View className="flex-row items-center">
          <Text className="opacity-75 text-[15px] mr-0 text-white">
            Account Balance
          </Text>
          <IconButton
            className="opacity-75"
            size={17}
            iconColor="white"
            icon={hideBalance ? "eye-off-outline" : "eye-outline"}
            onPress={onHideBalanceToggle}
          />
        </View>

        <View className="mt-0 flex-row items-center">
          {hideBalance ? (
            <Text className="text-3xl text-white font-bold items-center">
              ₦******{" "}
            </Text>
          ) : (
            <Text className="text-3xl text-white font-bold">₦{formatNumber(userInfo?.wallet?.balance) || "0.00"} </Text>
          )}
        </View>
        <View className="mt-5">
          <Text className="text-white opacity-75 text-[12px]">Cashback</Text>
          <View className="mt-2 flex-row items-center">
            {hideBalance ? (
              <Text className="text text-white font-bold items-center">
                ₦******{" "}
              </Text>
            ) : (
              <Text className="text-[15px] text-white font-bold">
                ₦{formatNumber(userInfo?.wallet?.cashback) || "0.00"}{" "}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="absolute p-3 bottom-0 right-0 space-y-3 items-center">
        <EaseView
          animate={{ rotate: fetchingInfo ? 360 : 0 }}
          transition={{ duration: 2000, type: "timing" }}
          className="self-end mr-3"
        >
          <Pressable onPress={fetchInfo}>
            <Icon size={24} color="white" source={"sync"} />
          </Pressable>
        </EaseView>
        <Button
          onPress={() => router.push("/add_money")}
          buttonColor={theme.colors.onPrimary}
          textColor={theme.colors.primary}
          mode="contained"
          icon="plus"
        >
          Add Money
        </Button>
      </View>
    </LinearGradient>
  );
};

export default BalanceContainer;
