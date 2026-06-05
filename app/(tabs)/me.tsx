import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Image,
  StatusBar as RNStatusBar,
  ScrollView,
  useColorScheme,
  ColorValue,
  BackHandler,
  Pressable,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTheme,
  Text,
  Appbar,
  List,
  Switch,
  Dialog,
  Button,
  Portal,
  Divider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { router, useFocusEffect } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { RootLayoutContext } from "@/contexts/RootLayoutContext";
import BottomSheet from "@/components/models/BottomSheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import requests from "@/Network/HttpRequest";
import { showMessage } from "react-native-flash-message";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PaperSafeView } from "@/components/PaperView";
import CustomAppbar from "@/components/CustomAppbar";
import { formatNumber } from "@/constants/Formats";
import ActionButton from "@/components/Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const screen = Dimensions.get("screen");

interface ProfileTopProps {
  loaded: boolean;
  userInfo?: any;
  loadUserInfo: () => void;
}

interface ProfileCustomTabsProps {
  onSelectTab: (tabID: number) => void;
}
const ProfileCustomTabs = ({ onSelectTab }: ProfileCustomTabsProps) => {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(250);
  const tabX = useSharedValue(-containerWidth / 4);

  const handleOnLayout = (event: LayoutChangeEvent): void => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  const handleMoveTab = (value: number) => {
    tabX.value = value;
  };

  const tabAnimetedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(tabX.value, { damping: 80 }) }],
    };
  });

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        width: containerWidth,
      }}
      className="h-[40px] rounded-full   flex-row  items-center justify-center"
    >
      <Pressable
        className="h-full flex-1 rounded-full items-center justify-center"
        onPress={() => {
          handleMoveTab(-containerWidth / 4);
          onSelectTab(1);
        }}
      >
        <Button
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-details"
              size={size}
              color={color}
            />
          )}
        >
          Details
        </Button>
      </Pressable>
      <Pressable
        className="h-full flex-1 rounded-full items-center justify-center"
        onPress={() => {
          handleMoveTab(containerWidth / 4);
          onSelectTab(2);
        }}
      >
        <Button
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          )}
        >
          Settings
        </Button>
      </Pressable>

      <Animated.View
        style={[
          tabAnimetedStyle,
          {
            width: containerWidth / 2,
          },
        ]}
        className="h-full bg-[#1ca3e655]  border-2 border-[#1c4be66d] rounded-full absolute "
      ></Animated.View>
    </View>
  );
};

const ProfileTop = ({ loaded, userInfo, loadUserInfo }: ProfileTopProps) => {
  const theme = useTheme();

  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, theme.colors.primaryContainer];
    }
    return [theme.colors.primary, theme.colors.primary];
  };
  return (
    <View className="rounded-b-lg w-screen px-5">
      <View className="items-center flex-row gap-x-2">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 300, type: "timing" }}
        >
          <Image
            className="h-13 w-13 rounded-full"
            source={require("@/assets/images/profile_avatar.png")}
          />
        </EaseView>
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 300, type: "timing", delay: 200 }}
          className="gap-y-5"
        >
          <Text style={{fontFamily:"ArchivoBlackRegular", fontSize: 20}} className="text-white mb-2">
            {userInfo?.full_name}
          </Text>
          <View>
            <View className="bg-green-500 w-18 rounded-full items-center py-px border-green-700 border">
              <Text style={{ alignItems: "center", color: "white" }}>
                ACTIVE
              </Text>
            </View>
          </View>
        </EaseView>
      </View>
    </View>
  );
};

const Me = () => {
  const theme = useTheme();

  const [loaded, setLoaded] = useState(false);

  const [userInfo, setUserInfo] = useState<any>(undefined);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserInfo();
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const checkLoginState = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.push("/logins/emailLogin");
      }
    } catch (error) {
      console.error("Error checking login state:", error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        setUserInfo(JSON.parse(userInfoString));
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const fetchData = async () => {
    const response = await requests.get({ url: "/user/info" });
    if (response.status == 1) {
      setUserInfo(response?.data);
    }

    if (response.status == 0) {
      showMessage({
        message: "Error",
        description: response.message,
        type: "danger",
      });
    }

    if (response.status == undefined) {
      loadUserInfo();
      setNetworkErrorSheetVisible(true);
    }
  };

  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, "#ffa60042"];
    }
    return [theme.colors.primary, theme.colors.primary, theme.colors.accent];
  };

  return (
    <PaperSafeView>
      <CustomAppbar>
        <Appbar.Content
          color="white"
          title={<Text className="text-lg font-bold">Profile</Text>}
        />
        <Appbar.Action
          onPress={() => router.push("/notifications")}
          icon={"bell"}
        />
        <Appbar.Action onPress={() => router.push("/settings")} icon={"cog"} />
      </CustomAppbar>
      <ScrollView className="flex-1 w-screen">
        <ProfileTop
          loadUserInfo={loadUserInfo}
          userInfo={userInfo}
          loaded={loaded}
        />
        <View className="flex-1 px-4">
          {/* balance view */}
          <LinearGradient
            colors={getColors()}
            start={{ x: 1, y: 0.5 }}
            end={{ x: -0.2, y: 1.2 }}
            style={{ borderRadius: 12 }}
            className="relative h-[90px] w-full rounded-lg py-5 mt-5  p-4 flex-row items-center justify-between px-5"
          >
            <View className="gap-y-1">
              <Text style={{ color: "white", fontSize: 15 }}>
                Bunus Balance
              </Text>
              <View className="flex-row items-center gap-x-1">
                <Text
                  style={{ color: "white", fontSize: 20, textAlign: "center" }}
                  className=" font-[ArchivoBlackRegular]"
                >
                  ₦{formatNumber(userInfo?.wallet?.bunus) || "0.00"}{" "}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  color={"white"}
                  size={24}
                />
              </View>
            </View>

            <View className="gap-y-1">
              <Text style={{ color: "white", fontSize: 15 }}>
                Cashback Balance
              </Text>
              <View className="flex-row items-center gap-x-1">
                <Text
                  style={{ color: "white", fontSize: 20, textAlign: "center" }}
                  className=" font-[ArchivoBlackRegular]"
                >
                  ₦{formatNumber(userInfo?.wallet?.cashack) || "0.00"}{" "}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  color={"white"}
                  size={24}
                />
              
              </View>
            </View>
          </LinearGradient>

          {/* end balance view */}

          <View className="mt-5 flex-row items-center gap-x-5">
            <ActionButton
              icon={() => (
                <MaterialIcons name="savings" size={24}  color={theme.colors.onBackground}/>
              )}
              label="Saving"
            />
              <ActionButton
                  onPress={() => router.push("/earning")}
                  label="Earnning"
                  icon={({ color }) => (
                   <FontAwesome5 name="money-bill-wave" size={24} color={theme.colors.onBackground} />
                  )}
                />
          </View>

          <View className="flex-row items-center mt-5 px-0 space-x-3">
            <Text>Details</Text>
          </View>

          <View className="mt-2">
            <List.Item
              descriptionStyle={{ fontFamily: "ArchivoBlackRegular" }}
              titleStyle={{ opacity: 0.6 }}
              title="Email Address"
              description={userInfo?.email || "No email provided"}
              left={({ color }) => (
                <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                  <Fontisto name="email" size={24} color={color} />
                </View>
              )}
            />

            <List.Item
              title="Username"
              description={userInfo?.username}
              descriptionStyle={{ fontFamily: "ArchivoBlackRegular" }}
              titleStyle={{ opacity: 0.6 }}
              left={({ color }) => (
                <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1ca3e61c]">
                  <List.Icon icon={"account"} />
                </View>
              )}
            />

            <List.Item
              descriptionStyle={{ fontFamily: "ArchivoBlackRegular" }}
              titleStyle={{ opacity: 0.6 }}
              title="Date Joined"
              description={
                userInfo?.date_joined
                  ? new Date(userInfo.date_joined).toDateString()
                  : "N/A"
              }
              left={({ color }) => (
                <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1952bd31]">
                  <Fontisto name="date" size={24} color={color} />
                </View>
              )}
            />

            <List.Item
              title="State/Region"
              description={"Kaduna"}
              descriptionStyle={{ fontFamily: "ArchivoBlackRegular" }}
              titleStyle={{ opacity: 0.6 }}
              left={({ color }) => (
                <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1ca3e61c]">
                  <FontAwesome6 name="location-dot" size={24} color={color} />
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>

      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default Me;
