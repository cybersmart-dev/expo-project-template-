import BalanceContainer from '@/components/Containers/BalanceContainer';
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Appbar, Button } from "react-native-paper";

export default function Index() {
    const theme = useTheme();

    return (
        <SafeAreaView
            style={{ backgroundColor: theme.colors.background }}
            className="px-3 flex flex-1"
        >
            <Appbar>
                <Appbar.Content title="Test" />
            </Appbar>
            <View className="px-2">
                <BalanceContainer theme={theme}/>
 

                <View></View>
            </View>
        </SafeAreaView>
    );
}
