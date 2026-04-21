import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkScheme, LightScheme } from "../Themes/ThemeSchemes";
import "react-native-reanimated";
import { useColorScheme, StatusBar as RNStatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";
import { RootLayoutContext } from "@/contexts/RootLayoutContext";

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

  const [activeTheme, setActiveTheme] = useState(colorScheme);

  const isSupportFormSheet = () => {
    return false;
  };

  const getTheme = () => {
    const theme = activeTheme == "dark" ? DarkTheme : LightTheme;
    if (activeTheme == "system") {
      return colorScheme == "dark" ? DarkTheme : LightTheme;
    }
    return theme;
  };

  useEffect(() => {}, [activeTheme]);

  return (
    <SafeAreaProvider>
      <RootLayoutContext.Provider value={{ activeTheme, setActiveTheme }}>
        <PaperProvider theme={getTheme()}>
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
                presentation: isSupportFormSheet()
                  ? "formSheet"
                  : "containedModal",
                title: "Singup",
                headerShown: false,
              }}
            />

            {/** logins */}
            <Stack.Screen
              name="logins/emailLogin"
              options={{
                presentation: isSupportFormSheet()
                  ? "formSheet"
                  : "containedModal",
                title: "Singup",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="logins/phoneLogin"
              options={{
                presentation: isSupportFormSheet()
                  ? "formSheet"
                  : "containedModal",
                title: "Phone Login",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="logins/setupPassword"
              options={{
                presentation: isSupportFormSheet()
                  ? "formSheet"
                  : "containedModal",

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

            <Stack.Screen
              name="logins/singin"
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

            <Stack.Screen
              name="airtime2cash/airtime2cash"
              options={{
                presentation: "containedModal",
                title: "Airtime2Cash",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="airtime2cash/transfer"
              options={{
                presentation: "containedModal",
                title: "Airtime2Cash",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="add_money"
              options={{
                presentation: "containedModal",
                title: "Add Money",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="notifications"
              options={{
                presentation: "containedModal",
                title: "Notifications",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="betting"
              options={{
                presentation: "containedModal",
                title: "Betting",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="electricity"
              options={{
                presentation: "containedModal",
                title: "Electricity",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="cabletv"
              options={{
                presentation: "containedModal",
                title: "Cable Tv",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="result-chacker"
              options={{
                presentation: "containedModal",
                title: "Result Chacker",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="earning"
              options={{
                presentation: "containedModal",
                title: "earning",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="widthdraw"
              options={{
                presentation: "containedModal",
                title: "earning",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="contactus"
              options={{
                presentation: "containedModal",
                title: "Contact Us",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="PinManagement/change-pin"
              options={{
                presentation: "containedModal",
                title: "Change Pin",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="PinManagement/reset-pin"
              options={{
                presentation: "containedModal",
                title: "Change Pin",
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
            <Stack.Screen
              name="modals/transfer_response"
              options={{
                presentation: "fullScreenModal",
                title: "Transfer Response",
                headerShown: false,
              }}
            />

            {/** end modal */}

            <Stack.Screen
              name="TransactionDetails/[id]"
              options={{
                presentation: "fullScreenModal",
                title: "TransactionDetails",
                headerShown: false,
              }}
            />
          </Stack>
        </PaperProvider>
        <StatusBar style={getTheme().dark ? "light" : "dark"} />
        <FlashMessage
          style={{ borderRadius: 12 }}
          position={{
            top:
              RNStatusBar.currentHeight != undefined
                ? RNStatusBar.currentHeight + 20
                : 50,
            left: 50,
            right: 50,
          }}
        />
      </RootLayoutContext.Provider>
    </SafeAreaProvider>
  );
}
