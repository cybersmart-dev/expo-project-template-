import { LightTheme } from "@/app/_layout";
import { formatNumber } from "@/constants/Formats";
import { Timer } from "@/constants/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ColorValue, Pressable, useColorScheme, View } from "react-native";
import { EaseView } from "react-native-ease";
import {
  AnimatedFAB,
  Button,
  Icon,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import Animated, {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";
import { Toast } from "@/constants/Toast";

const AnimatedButton = createAnimatedComponent(Button);

interface BalanceContainerProps {
  user?: Object;
  theme?: any;
  hideBalance?: boolean;
  userInfo?: any;
  fetchingInfo: boolean;
  onHideBalanceToggle?: () => void;
  fetchInfo: () => void;
}
const BalanceContainer = ({
  user,
  hideBalance,
  onHideBalanceToggle,
  userInfo,
  fetchingInfo,
  fetchInfo,
}: BalanceContainerProps) => {
  const timerRef = useRef(0);
  const colorScheme = useColorScheme();
  const theme = useTheme<typeof LightTheme>();
  const bounce = useSharedValue(0);
  const [virtualAccounts, setVirtualAccounts] = useState<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>();

  let addMoneyWidthTimer = useRef(0);
  const addMoneyWidthX = useSharedValue(0);

  const [loaded, setLoaded] = useState(false);

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
    if (addMoneyWidthX.value >= 140) {
      addMoneyWidthX.value = 0;
    }
    addMoneyWidthTimer.current = setInterval(() => {
      addMoneyWidthX.value = addMoneyWidthX.value + 4;

      if (addMoneyWidthX.value >= 140) {
        clearInterval(addMoneyWidthTimer.current);
        addMoneyWidthTimer.current = 0;
        bounceLoopAnimation();
      }
    }, 1);
  };

  const bounceLoopAnimation = () => {
    const loop = () => {
      bounce.value = bounce.value + 1;
      if (bounce.value >= 5) {
        bounce.value = 0;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };

  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, "#ffa60042"];
    }
    return [theme.colors.primary, theme.colors.primary, theme.colors.accent];
  };

  useFocusEffect(
    useCallback(() => {
      getVirtualAccounts();
      return () => {};
    }, []),
  );

  const getVirtualAccounts = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const virtualAccounts: Array<any> = userInfo.virtual_accounts || [];

        setVirtualAccounts(virtualAccounts[0]);
      }
    } catch (error) {
      console.error("Error fetching virtual accounts:", error);
    }
  };

  const copyAccountNumner = useCallback(async () => {
    console.log("account: ", virtualAccounts?.accountNumber);

    if (virtualAccounts?.accountNumber) {
      await Clipboard.setStringAsync(virtualAccounts?.accountNumber);
      Toast.success({ title: "Copied" });
      return;
    }
    Toast.dangerHapticsAsync({ title: "Failed to copy account number" });
  }, [virtualAccounts]);

  return (
    <LinearGradient
      colors={getColors()}
      start={{ x: 1, y: 0.5 }}
      end={{ x: -0.2, y: 1.2 }}
      style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, height: "auto", minHeight: 150 }}
      className="relative w-full rounded-t-2xl pb-5 mt-0  p-4 "
    >
      <View>
        {virtualAccounts ? (
          <Pressable
            onPress={copyAccountNumner}
            className="items-center flex-row"
          >
            <Text style={{ color: "white" }}>
              {virtualAccounts?.bankName} | {virtualAccounts?.accountNumber}
            </Text>
            <Pressable className="ml-2">
              <Icon color="white" source={"content-copy"} size={15} />
            </Pressable>
          </Pressable>
        ) : (
          ""
        )}

        <View className="flex-row items-center mt-3">
          {hideBalance ? (
            <Text
              style={{ color: "white" }}
              className="text-3xl font-[ArchivoBlackRegular] items-center "
            >
              ₦******{" "}
            </Text>
          ) : (
            <Text
              style={{ color: "white", fontWeight: "bold" }}
              className="text-4xl font-[ArchivoBlackRegular]"
            >
              ₦{formatNumber(userInfo?.wallet?.balance) || "0.00"}{" "}
            </Text>
          )}
          <Pressable onPress={onHideBalanceToggle}>
            <Icon
              size={17}
              color="white"
              source={hideBalance ? "eye-outline" : "eye-off-outline"}
            />
          </Pressable>
        </View>
      </View>

     
        <View className="flex-row justify-around mt-7 w-full gap-x-2">
          <Button onPress={() => router.push("/widthdraw")} icon={"bank"} mode={"contained-tonal"}>
            Withdraw
          </Button>

          <Button
            icon={"plus"}
            onPress={() => router.push("/add_money")}
            mode={"contained-tonal"}
          >
            Add Money
          </Button>
        </View>
      
    </LinearGradient>
  );
};

export default BalanceContainer;
