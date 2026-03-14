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

import { useColorScheme, StatusBar as RNStatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";

const DarkTheme = {
  ...MD3DarkTheme,
  colors: DarkScheme,
};
const LightTheme = {
  ...MD3LightTheme,
  colors: LightScheme,
};
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
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
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="view/[id]"
            options={{
              presentation: "modal",
              title: "Mail",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="singup"
            options={{
              presentation: "formSheet",
              title: "Singup",
              headerShown: false,
            }}
          />

          {/** logins */}
          <Stack.Screen
            name="logins/emailLogin"
            options={{
              presentation: "formSheet",
              title: "Singup",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="logins/phoneLogin"
            options={{
              presentation: "formSheet",
              title: "Phone Login",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="logins/setupPassword"
            options={{
              presentation: "formSheet",

              title: "Phone Login",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modals/processing"
            options={{
              presentation: "containedTransparentModal",
              title: "Phone Login",
              headerShown: false,
            }}
          />
          {/** end logins */}

          {/** protected screens */}

          <Stack.Screen
            name="profile"
            options={{
              presentation: "formSheet",
              title: "Singup",
              headerShown: false,
            }}
          />

           <Stack.Screen
            name="buy-data"
            options={{
              presentation: "containedModal",
              title: "Buy Data",
              headerShown: false,
            }}
          />

           <Stack.Screen
            name="buy-airtime"
            options={{
              presentation: "containedModal",
              title: "Buy Airtime",
              headerShown: false,
            }}
          />

          {/** end protected screens */}

          <Stack.Screen
            name="modals/pin_sheet"
            options={{
              presentation: "transparentModal",
              title: "Pin",
              headerShown: false,
            }}
          />
        </Stack>

        <StatusBar backgroundColor={theme.colors.primary} style="light" />

        <FlashMessage
          style={{ marginTop: RNStatusBar.currentHeight }}
          position={"top"}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
