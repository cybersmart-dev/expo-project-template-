import { View, Modal, Platform } from "react-native";
import React from "react";
import { PaperSafeView } from "../PaperView";
import { Appbar, Button, Text } from "react-native-paper";
import { Image } from "expo-image";
import * as IntentLauncher from "expo-intent-launcher";
import { router } from "expo-router";
import BottomLayout from "../Containers/BottomLayout";

interface NoConnectionModalProps {
  visible: boolean;
  title?: string,
  description?: string,
  onRetry?: () => void;
}

const NoConnectionModal = ({ visible, title="Conntect to the internet", description, onRetry }: NoConnectionModalProps) => {
  const goToSetting = async () => {
    if (Platform.OS == "android") {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.NETWORK_OPERATOR_SETTINGS,
      );
      return;
    }
  };
  return (
    <Modal visible={visible} onRequestClose={() => router.back()}>
      <PaperSafeView>
        <Appbar className="bg-transparent">
          <Appbar.BackAction onPress={() => router.back()} />
        </Appbar>

        <View className="flex-1 h-screen ">
          <View className="w-full items-center">
            <Image
              className="h-[200px] w-32 rounded-full"
              source={require("@/assets/images/gif/no_connection_anim2.gif")}
            />
          </View>
          <View className="w-full items-center mt-5 px-5">
            <Text className="text-lg font-bold">{title}</Text>
            <Text>Failed to load transactions: network disconnected</Text>
          </View>
         
            <BottomLayout>
              <View className="px-5 pt-5 space-y-5">
                <Button
                  onPress={onRetry}
                  className="text-lg p-1"
                  style={{ borderRadius: 15 }}
                  labelStyle={{ fontSize: 16 }}
                  mode="contained"
                >
                  Retry
                </Button>
                <Button
                  onPress={goToSetting}
                  className="text-lg p-1"
                  style={{ borderRadius: 15 }}
                  labelStyle={{ fontSize: 16 }}
                  mode="outlined"
                >
                  Go to settings
                </Button>
              </View>
            </BottomLayout>
          
        </View>
      </PaperSafeView>
    </Modal>
  );
};

export default NoConnectionModal;
