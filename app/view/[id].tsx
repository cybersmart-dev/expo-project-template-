import React, { useEffect, useCallback, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    BackHandler,
    Dimensions,
    Keyboard,
    Platform,
    StatusBar as Bar
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
    useLocalSearchParams,
    useNavigation,
    useFocusEffect
} from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTheme, Text, Appbar, IconButton } from "react-native-paper";

const { height, width } = Dimensions.get("window");

interface SingleMailProps {
    mail: string;
    date: string;
    title: string;
}

const Mail = () => {
    
    const theme = useTheme();
    
    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.colors.background,
                height: height
            }}
        ></SafeAreaView>
    );
};

export default Mail;
