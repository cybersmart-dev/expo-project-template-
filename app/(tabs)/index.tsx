import BalanceContainer from "@/components/Containers/BalanceContainer";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Appbar } from "react-native-paper";
import { Image } from "react-native";
import { HomeQuickActionsContainer } from "@/components/Containers/HomeQuickActionsContainer";
import ServicesContainer from "@/components/Containers/ServicesContainer";
import HomeSliderContainer from "@/components/Containers/HomeSliderContainer";
import { router } from "expo-router";
import BottomSheet from "@/components/models/BottomSheet";
import CreatePinContainer from "@/components/Containers/CreatePinContainer";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const theme = useTheme();
  const [hideBalance, setHideBalance] = useState(false);
  const [showPinSheet, setShowPinSheet] = useState(false);

  useEffect(() => {
    if (true) {
      setShowPinSheet(true);
    }
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.colors.background }}
      className="flex flex-1"
    >
      <Appbar style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Content
          title={
            <TouchableOpacity
              onPress={() => router.push("/me")}
              className="flex-row items-center space-x-2"
            >
              <Image
                className="h-7 w-7 rounded-full"
                source={require("@/assets/images/profile_avatar.png")}
              />
              <Text className="text-white">Mustapha Aminu</Text>
            </TouchableOpacity>
          }
        />
        <Appbar.Action color="white" icon={"bell-outline"} />
        <Appbar.Action color="white" icon={"face-agent"} />
      </Appbar>

      <ScrollView  refreshControl={<RefreshControl refreshing={false} />} className="pb-5 flex-1">
        <View className="">
          <BalanceContainer
            theme={theme}
            hideBalance={hideBalance}
            onHideBalanceToggle={() => setHideBalance(!hideBalance)}
          />
        </View>

        <View className="p-3">
          <Text className="mb-4 ml-2 font-bold">Quick Actions</Text>
          <HomeQuickActionsContainer />
        </View>
        <View className="p-3">
          <HomeSliderContainer />
        </View>
        <View className="p-3">
          <Text className="mb-3 ml-2 font-bold">Services</Text>
          <ServicesContainer />
        </View>
      </ScrollView>
      <BottomSheet
        mode="full-width"
        dismissable={true}
        visible={showPinSheet}
        onDismiss={() => setShowPinSheet(false)}
      >
        <CreatePinContainer
          onSkip={() => setShowPinSheet(false)}
          onCreate={(pin: string) => alert("pin created " + pin)}
        />
      </BottomSheet>

      <StatusBar backgroundColor={theme.colors.primary} style="light" />
    </SafeAreaView>
  );
}
