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
    <LinearGradient
      colors={getColors()}
      style={{
        backgroundColor: theme.dark
          ? theme.colors.primaryContainer
          : theme.colors.primary,
      }}
      className="h-56 rounded-b-lg w-screen items-center justify-center"
    >
      <View className="items-center space-y-2">
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 300, type: "timing" }}
        >
          <Image
            className="h-20 w-20 rounded-full"
            source={require("@/assets/images/profile_avatar.png")}
          />
        </EaseView>
        <EaseView
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 300, type: "timing", delay: 200 }}
        >
          <Text className="text-white  text-2xl font-[ArchivoBlackRegular]">
            {userInfo?.full_name || (
              <Button onPress={loadUserInfo} mode="outlined" textColor="white">
                Load data failed tap to reload
              </Button>
            )}
          </Text>
        </EaseView>
      
       
      </View>
    </LinearGradient>
  );
};

const Me = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [checked, setChecked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [userInfo, setUserInfo] = useState<object | undefined>(undefined);
  const [networkErrorSheetVisible, setNetworkErrorSheetVisible] =
    useState(false);
  const [changeAvatarDialogVisible, setChangeAvatarDialogVisible] =
    useState(false);
  const [pinManagementSheetVisible, setPinManagementSheetVisible] =
    useState(false);
  const [deleteAccountDialogVisible, setDeleteAccountDialogVisible] =
    useState(false);
  const [themeSelectedSheetVisible, setThemeSelectedSheetVisible] =
    useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [activeTab, setActiveTab] = useState(1);
 

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

  return (
    <LinearGradient
      colors={[theme.colors.secondaryContainer, theme.colors.background]}
      locations={[0, 1]}
      start={{ x: 100, y: 0 }}
      style={{ backgroundColor: theme.colors.background }}
      className="px-3 flex flex-1 justify-center items-center"
    >
      <Appbar
        className="w-screen"
        style={{
          backgroundColor: theme.dark
            ? theme.colors.primaryContainer
            : theme.colors.primary,
          paddingTop: RNStatusBar.currentHeight,
        }}
      >
        <Appbar.Content
          color="white"
          title={
            <Text className="text-lg font-bold text-white">
              Profile & Settings
            </Text>
          }
        />
        <Appbar.Action
          onPress={() => router.push("/notifications")}
          color="white"
          icon={"bell"}
        />
      </Appbar>
      <ScrollView className="flex-1 w-screen">
        <ProfileTop
          loadUserInfo={loadUserInfo}
          userInfo={userInfo}
          loaded={loaded}
        />
        <View className="flex-1">
          <View className="flex-row items-center mt-5 px-3 space-x-3">
            <ProfileCustomTabs onSelectTab={setActiveTab} />
          </View>

          {activeTab == 1 && (
            <View className="px-4 mt-2">
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
                    <List.Icon icon={'account'} />
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
          )}

          {activeTab == 2 && (
            <View className="px-4">
              <View className="rounded-lg">
                <List.Section>
                  <List.Item
                    titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    title="Edit Profile"
                    description="Set Your Profile Avatar"
                    onPress={() => setChangeAvatarDialogVisible(true)}
                    left={({ color }) => (
                      <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                        <FontAwesome5
                          name="user-edit"
                          size={17}
                          color={theme.dark ? "lightgreen" : "green"}
                        />
                      </View>
                    )}
                  />
                  <List.Item
                    onPress={() => setPinManagementSheetVisible(true)}
                    titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    title="Pin Management"
                    description="Secure your account"
                    left={({ color }) => (
                      <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1952bd31]">
                        <FontAwesome5
                          name="key"
                          size={17}
                          color={theme.dark ? "lightblue" : "blue"}
                        />
                      </View>
                    )}
                  />

                  <List.Item
                    title="Switch theme"
                    description="Switch to diffrent themes"
                    titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    onPress={() => setThemeSelectedSheetVisible(true)}
                    left={({ color }) => (
                      <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1ca3e61c]">
                        <MaterialCommunityIcons
                          name="theme-light-dark"
                          size={17}
                          color={color}
                        />
                      </View>
                    )}
                    right={() => (
                      <List.Icon
                        icon={() => (
                          <View>
                            <Text>{`$System`.toUpperCase()}</Text>
                          </View>
                        )}
                      />
                    )}
                  />
                  <List.Item
                    title="Check For Update"
                    description="Check for release"
                    titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    left={({ color }) => (
                      <View className="w-8 h-8 rounded-full items-center justify-center bg-[#1ca3e61c]">
                        <MaterialIcons name="update" size={24} color={color} />
                      </View>
                    )}
                  />

                  <List.Item
                    title="Exit App"
                    description="Exit from app"
                    titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    onPress={() => BackHandler.exitApp()}
                    left={({ color }) => (
                      <View className="w-8 h-8 rounded-full items-center justify-center bg-[#ba141427]">
                        <MaterialIcons
                          name="exit-to-app"
                          size={24}
                          color={theme.dark ? "#e77b7b" : "#840606"}
                        />
                      </View>
                    )}
                  />

                  <List.Item
                    title="Logout"
                    onPress={() => router.navigate("/logins/singin")}
                    titleStyle={{ color: "red" }}
                    descriptionStyle={{ opacity: 0.6 }}
                    left={({ color }) => (
                      <List.Icon color="red" icon={"door-open"} />
                    )}
                  />
                  <List.Item
                    titleStyle={{ color: "red" }}
                    onPress={() => {
                      setDeleteAccountDialogVisible(true);
                    }}
                    title="Delete Account"
                    left={({ color }) => (
                      <List.Icon color="red" icon={"delete"} />
                    )}
                  />
                </List.Section>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          style={{ backgroundColor: "#f72d2d" }}
          visible={deleteAccountDialogVisible}
          onDismiss={() => setDeleteAccountDialogVisible(false)}
        >
          <Dialog.Title className="text-white">Warning</Dialog.Title>
          <Dialog.Content>
            <Text className="text-white">
              Are you sure do you want to delete this account
            </Text>
          </Dialog.Content>
          <Dialog.Actions className="">
            <Button
              buttonColor="#cc5c5c"
              textColor={"white"}
              className="w-20"
              onPress={() => {
                setDeleteAccountDialogVisible(false);
              }}
              mode={"contained-tonal"}
            >
              Yes
            </Button>
            <Button
              textColor="black"
              buttonColor="lightgreen"
              className="w-20 text-[#cc5c5c]"
              onPress={() => setDeleteAccountDialogVisible(false)}
              mode={"contained-tonal"}
            >
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <StatusBar key={`${loaded}`} style="light" />

      <BottomSheet
        visible={themeSelectedSheetVisible}
        onDismiss={setThemeSelectedSheetVisible}
      >
        <View className="p-3">
          <Text className="font-bold">Selected Theme</Text>
        </View>
        <View className="py-2 px-5">
          <List.Item
            title="System"
            onPress={() => {
              setThemeSelectedSheetVisible(false);
              setActiveTheme("system");
            }}
            left={({ color }) => (
              <Octicons name="device-mobile" size={24} color={color} />
            )}
          />
          <Divider />
          <List.Item
            title="Light"
            onPress={() => {
              setThemeSelectedSheetVisible(false);
              setActiveTheme("light");
            }}
            left={({ color }) => (
              <MaterialIcons name="light-mode" size={24} color={color} />
            )}
          />
          <Divider />
          <List.Item
            title="Dark"
            onPress={() => {
              setThemeSelectedSheetVisible(false);
              setActiveTheme("dark");
            }}
            left={({ color }) => (
              <MaterialIcons name="dark-mode" size={24} color={color} />
            )}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={pinManagementSheetVisible}
        onDismiss={setPinManagementSheetVisible}
        height={"auto"}
      >
        <View className="p-3">
          <Text className="font-bold">Pin Management</Text>
        </View>
        <View className="py-2 px-5">
          <List.Item
            title="Change Pin"
            onPress={() => {
              setPinManagementSheetVisible(false);
              router.push("/PinManagement/change-pin");
            }}
            left={({ color }) => (
              <MaterialCommunityIcons
                name="key-change"
                size={24}
                color={color}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Reset Pin"
            onPress={() => {
              setPinManagementSheetVisible(false);
              router.push("/PinManagement/reset-pin");
            }}
            left={({ color }) => (
              <MaterialIcons name="lock-reset" size={24} color={color} />
            )}
          />
        </View>
      </BottomSheet>

      <Portal>
        <Dialog
          onDismiss={() => setChangeAvatarDialogVisible(false)}
          visible={changeAvatarDialogVisible}
        >
          <Dialog.Title>Change Avatar</Dialog.Title>

          <Dialog.Actions>
            <Button onPress={() => setChangeAvatarDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={() => setChangeAvatarDialogVisible(false)}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
};

export default Me;
