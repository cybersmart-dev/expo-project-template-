import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text } from "react-native-paper";

export default function TabOneScreen() {
    const theme = useTheme()
    
   return (
       <SafeAreaView style={{ backgroundColor: theme.colors.background,}} className="px-3 flex flex-1 justify-center items-center">
            <Text className="text-3xl">TabOneScreen 1</Text>
            <Text className="text-2xl mt-3">React Native + Expo Router + NativeWind + React Native paper 💚</Text>
       </SafeAreaView>
    )
}
