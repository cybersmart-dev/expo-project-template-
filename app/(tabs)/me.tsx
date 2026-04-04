import React, { useCallback, useState } from "react";
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
import { useTheme, Text, Appbar, List, Switch, Dialog, Button, Portal } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { EaseView } from "react-native-ease";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Me = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [checked, setChecked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [deleteAccountDialogVisible, setDeleteAccountDialogVisible] = useState(false)
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);

      return () => {
        setLoaded(false);
      };
    }, []),
  );

  const getColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    if (theme.dark) {
      return [theme.colors.primaryContainer, theme.colors.secondaryContainer];
    }
    return [theme.colors.primary, theme.colors.secondary];
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
        <View className="flex-1">
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
                  Mustapha Aminu
                </Text>
              </EaseView>
              <EaseView
                animate={{
                  opacity: loaded ? 1 : 0,
                  translateY: loaded ? 0 : -20,
                }}
                transition={{ duration: 300, type: "timing", delay: 400 }}
              >
                <Text className="text-white opacity-50">
                  Software Engineer Security Researcher
                </Text>
              </EaseView>
            </View>
          </LinearGradient>

          <View className="px-4 mt-5">
            <List.Section>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Edit Profile"
                left={() => <List.Icon icon={"account-edit"} />}
              />
              <List.Item
                title="Pin Management"
                left={() => <List.Icon icon={"key"} />}
              />
              <List.Subheader>App</List.Subheader>
              <List.Item
                title="Dark Theme"
                onPress={onToggleSwitch}
                left={() => <List.Icon icon={"brightness-2"} />}
                right={() => (
                  <List.Icon
                    icon={() => (
                      <Switch
                        value={isSwitchOn}
                        onValueChange={onToggleSwitch}
                      />
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
                onPress={() => router.navigate('/logins/singin')}
                titleStyle={{ color: "red" }}
                left={() => <List.Icon color="red" icon={"door-open"} />}
              />
              <List.Item
                titleStyle={{ color: "red" }}
                onPress={() => {
                 setDeleteAccountDialogVisible(true)
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
          style={{backgroundColor:'#f72d2d'}}
          visible={deleteAccountDialogVisible}
          onDismiss={() => setDeleteAccountDialogVisible(false)}
        >
          <Dialog.Title className="text-white">Warning</Dialog.Title>
          <Dialog.Content>
            <Text className="text-white">Are you sure do you want to delete this account</Text>
          </Dialog.Content>
          <Dialog.Actions className="">
            <Button
              buttonColor="#cc5c5c"
              textColor={'white'}
              className="w-20"
              onPress={() => {
                setDeleteAccountDialogVisible(false)
                
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
    </LinearGradient>
  );
};

export default Me;
