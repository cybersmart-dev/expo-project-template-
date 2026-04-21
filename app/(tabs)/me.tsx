import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  StatusBar as RNStatusBar,
  ScrollView,
  useColorScheme,
  ColorValue,
  BackHandler,
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

interface ProfileTopProps {
  loaded: boolean;
  userInfo?: any;
  loadUserInfo: () => void;
}

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
          <Text className="text-white text-2xl font-bold">
            {userInfo?.full_name || (
              <Button onPress={loadUserInfo} mode="outlined" textColor="white">
                Load data failed tap to reload
              </Button>
            )}
          </Text>
        </EaseView>
        <EaseView
          className="items-center"
          animate={{
            opacity: loaded ? 1 : 0,
            translateY: loaded ? 0 : -20,
          }}
          transition={{ duration: 300, type: "timing", delay: 400 }}
        >
          <Text className="text-white opacity-50">
            Joined on {userInfo?.date_joined ? new Date(userInfo.date_joined).toDateString() : "N/A"}
          </Text>
          <Text className="text-white opacity-50">
            {userInfo?.email || "No email provided"}
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
  const { activeTheme, setActiveTheme } = useContext(RootLayoutContext);

  useFocusEffect(
    useCallback(() => {
      checkLoginState();
      loadUserInfo();
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  useEffect(() => {
    setActiveTheme(isSwitchOn ? "dark" : colorScheme);
  }, [isSwitchOn]);

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
        <Appbar.Content color="white" title="Profile" />
        <Appbar.Action
          onPress={() => router.push("/notifications")}
          color="white"
          icon={"bell"}
        />
      </Appbar>
      <ScrollView className="flex-1 w-screen">
        <ProfileTop loadUserInfo={loadUserInfo} userInfo={userInfo} loaded={loaded} />
        <View className="flex-1">
          <View className="px-4 mt-5">
            <List.Section>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Edit Profile"
                onPress={() => setChangeAvatarDialogVisible(true)}
                left={() => <List.Icon icon={"account-edit"} />}
              />
              <List.Item
                onPress={() => setPinManagementSheetVisible(true)}
                title="Pin Management"
                left={() => <List.Icon icon={"key"} />}
              />
              <List.Subheader>App</List.Subheader>
              <List.Item
                title="Switch theme"
                onPress={() => setThemeSelectedSheetVisible(true)}
                left={({ color }) => (
                  <MaterialCommunityIcons
                    name="theme-light-dark"
                    size={24}
                    color={color}
                  />
                )}
                right={() => (
                  <List.Icon
                    icon={() => (
                      <View>
                        <Text>{`${activeTheme}`.toUpperCase()}</Text>
                      </View>
                    )}
                  />
                )}
              />
              <List.Item
                title="Check For Update"
                left={() => <List.Icon icon={"android"} />}
              />
              <List.Subheader>More</List.Subheader>

              <List.Item
                title="Exit App"
                onPress={() => BackHandler.exitApp()}
                left={() => <List.Icon icon={"door"} />}
              />

              <List.Item
                title="Logout"
                onPress={() => router.navigate("/logins/singin")}
                titleStyle={{ color: "red" }}
                left={() => <List.Icon color="red" icon={"door-open"} />}
              />
              <List.Item
                titleStyle={{ color: "red" }}
                onPress={() => {
                  setDeleteAccountDialogVisible(true);
                }}
                title="Delete Account"
                left={() => <List.Icon color="red" icon={"delete"} />}
              />
            </List.Section>
          </View>
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
