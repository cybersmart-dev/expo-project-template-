import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { IconButton, useTheme } from "react-native-paper";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
    size: number;
}) {
    return <FontAwesome size={size} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const theme = useTheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarBackground: () => (
                    <View
                        style={{
                            backgroundColor: theme.colors.background,
                            padding: 5,
                            height: 50
                        }}
                        className="flex-1 h-fit bg-transparent"
                    ></View>
                ),
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "TabOne",
                    tabBarIcon: ({ color, size }) => (
                        <IconButton
                            size={size}
                            iconColor={color}
                            icon="home"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="me"
                options={{
                    title: "TabTwo",
                    tabBarIcon: ({ color, size }) => (
                        <IconButton
                            size={size}
                            iconColor={color}
                            icon="cog"
                        />
                    )
                }}
            />
        </Tabs>
    );
}
