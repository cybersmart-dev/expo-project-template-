import { View, BackHandler } from "react-native";
import React, { useState } from "react";
import {
  Dialog,
  Divider,
  List,
  Portal,
  useTheme,
  Button,
  Appbar,
  Text,
  TextInput,
} from "react-native-paper";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { PaperSafeView } from "@/components/PaperView";
import BottomSheet from "@/components/models/BottomSheet";
import Octicons from "@expo/vector-icons/Octicons";
import CustomAppbar from "@/components/CustomAppbar";
import { StatusBar } from "expo-status-bar";
import ExitAppAlertDialog from "@/components/models/ExitAppAlertDialog";
import LogoutAlertDialog from "@/components/models/LogoutAlertDialog";

const settings = () => {
  const theme = useTheme();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [checked, setChecked] = useState(false);
  const [exitDialogVisible, setExitDialogVisible] = useState(false);
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
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  return (
    <PaperSafeView>
      <View>
        <CustomAppbar>
          <Appbar.Action
            onPress={() => router.back()}
            icon={() => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={theme.colors.onBackground}
              />
            )}
          />
          <Appbar.Content
            color="white"
            title={<Text className="text-lg font-bold">Settings</Text>}
          />
        </CustomAppbar>
        <View className="px-4">
          <View className="rounded-lg">
            <List.Section>
              <List.Item
                titleStyle={{ fontFamily: "ArchivoBlackRegular" }}
                descriptionStyle={{ opacity: 0.6 }}
                title="Login Settings"
                descriptionNumberOfLines={1}
                description="Reset/Change Password and setup Fingerprint Authentication"
                onPress={() => router.push("/login_settings")}
                right={({color}) => (
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    color={color}
                    size={24}
                  />
                )}
                left={({ color }) => (
                  <View className="w-8 h-8 rounded-full items-center justify-center bg-[#77ef9133]">
                    <FontAwesome5
                      name={"lock"}
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
                title="Payment Settings"
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
                        <Text>{`System`.toUpperCase()}</Text>
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
                onPress={() => setExitDialogVisible(true)}
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
                onPress={() => setLogoutDialogVisible(true)}
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
                left={({ color }) => <List.Icon color="red" icon={"delete"} />}
              />
            </List.Section>
          </View>
        </View>
      </View>
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

      <LogoutAlertDialog
        visible={logoutDialogVisible}
        onDismiss={setLogoutDialogVisible}
        onLogout={() =>  router.navigate("/logins/singin")}
        username="your account"
      />

      <ExitAppAlertDialog visible={exitDialogVisible} onDismiss={setExitDialogVisible} />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default settings;
