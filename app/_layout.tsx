import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkScheme, LightScheme } from "../Themes/ThemeSchemes";
import "react-native-reanimated";

import { useColorScheme } from "react-native";

const DarkTheme = {
    ...MD3DarkTheme,
    colors: DarkScheme
};
const LightTheme = {
    ...MD3LightTheme,
    colors: LightScheme
};
export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const theme = colorScheme == "dark" ? DarkTheme : LightTheme;
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <Stack>
                    {/* <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />*/}
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal" }}
                    />
                    <Stack.Screen
                        name="view/[id]"
                        options={{ presentation: "modal", title: "Mail", headerShown:false }}
                    />
                    <Stack.Screen
                        name="test"
                        options={{ presentation: "modal", title: "Mail", headerShown:false }}
                    />
                </Stack>
                {colorScheme == "dark" ? (
                    <StatusBar style={"light"} />
                ) : (
                    <StatusBar style="dark" />
                )}
            </PaperProvider>
        </SafeAreaProvider>
    );
}
