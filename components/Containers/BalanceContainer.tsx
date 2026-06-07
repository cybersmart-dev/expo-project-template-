import { LightTheme } from "@/app/_layout";
import { formatNumber } from "@/constants/Formats";
import { Timer } from "@/constants/Utils";
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

  return (
    <LinearGradient
      colors={getColors()}
      start={{ x: 1, y: 0.5 }}
      end={{ x: -0.2, y: 1.2 }}
      style={{ borderRadius: 12 }}
      className="relative h-[130px] w-full rounded-lg py-5 mt-0  p-4 "
    >
      <View>
        <View className="flex-row items-center">
          <Text
            style={{ color: "white" }}
            className="opacity-75 text-[15px] mr-0 text-white"
          >
            Total Assets
          </Text>
          <IconButton
            className="opacity-75"
            size={17}
            iconColor="white"
            icon={hideBalance ? "eye-off-outline" : "eye-outline"}
            onPress={onHideBalanceToggle}
          />
        </View>

        <View className="-mt-2 flex-row items-center">
          {hideBalance ? (
            <Text
              style={{ color: "white" }}
              className="text-3xl font-[ArchivoBlackRegular] items-center "
            >
              ₦******{" "}
            </Text>
          ) : (
            <Text
              style={{ color: "white" }}
              className="text-3xl font-[ArchivoBlackRegular]"
            >
              ₦{formatNumber(userInfo?.wallet?.balance) || "0.00"}{" "}
            </Text>
          )}
        </View>
      </View>

      <View className="absolute p-3 flex bottom-0 right-0 gap-y-3 items-center">
        <EaseView
          animate={{ rotate: fetchingInfo ? 360 : 0 }}
          transition={{ duration: 2000, type: "timing" }}
          style={{ alignSelf: "flex-end" }}
          className="mr-3 right-0"
        >
          <Pressable onPress={fetchInfo}>
            <Icon size={24} color="white" source={"sync"} />
          </Pressable>
        </EaseView>

        <Animated.View>
          <Pressable
          onPress={() => router.push("/add_money")}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            className="h-[33px] w-[130px] rounded-full items-center justify-center px-2"
          >
            <View className="w-full flex-row items-center justify-around">
              <Icon size={20} source={"plus"} />
              <Text numberOfLines={1} className="uppercase">Add Money</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default BalanceContainer;
