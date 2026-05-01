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
  const theme = useTheme();
  const bounce = useSharedValue(0);

  const [loaded, setLoaded] = useState(false);

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
    bounce.value = -20
    await new Timer().postDelayedAsync({ sec: 300 })
    bounce.value = 1
    
  }

  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, theme.colors.primaryContainer];
    }
    return [theme.colors.primary, theme.colors.primary];
  };

  const addMoneyButtonAnimetedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(bounce.value, { damping: 50 }) },
       
      ],
    };
  });

  return (
    <LinearGradient
      colors={getColors()}
      style={{
        backgroundColor: theme.dark
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
            <Text className="text-3xl text-white font-bold">
              ₦{formatNumber(userInfo?.wallet?.balance) || "0.00"}{" "}
            </Text>
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

        <Animated.View style={[addMoneyButtonAnimetedStyle]}>
          <Button
            onPress={() => router.push("/add_money")}
            
            icon="plus"
            textColor={"black"}
            buttonColor={
              theme.dark ? theme.colors.primary : theme.colors.primaryContainer
            }
          >
            ADD MONEY
          </Button>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default BalanceContainer;
