import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const PhoneLoginComponent = () => {
    const theme = useTheme();

    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const validateInput = () => {
        if (!phone) {
            return;
        }
        if (!password) {
            return;
        }
        login();
    };

    const login = async () => {
        router.push("(tabs)");
    };
    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.colors.background }}
        >
            <View className="absolute top-[120px] space-y-5 w-full items-center justify-center">
                <Image
                    className="h-14 w-14  rounded-full"
                    source={require("@/assets/images/profile_avatar.png")}
                />
                <View className="items-center">
                    <Text
                        style={{
                            color: theme.colors.onBackground,
                            fontSize: 20
                        }}
                    >
                        Login with phone number
                    </Text>
                    <Text
                        style={{
                            color: theme.colors.onBackground,
                            fontSize: 13,
                            marginBottom: 30,
                            opacity: 0.5
                        }}
                    >
                        some description here
                    </Text>
                </View>
            </View>
            <View
                className="h-auto pt-7 w-screen justify-center rounded-t-[30px]"
                style={{
                    position: "absolute",
                    bottom: 0,
                    marginTop: 10,

                    paddingBottom: 30,
                    backgroundColor: theme.colors.surfaceVariant
                }}
            >
                <View className="space-y-5 px-7 shadow-2xl">
                    <TextInput
                        label="Phone Number"
                        keyboardType={"number-pad"}
                        className="bg-transparent"
                        onChangeText={setPhone}
                        left={<TextInput.Icon size={20} icon="phone" />}
                    />
                    <TextInput
                        label="Password"
                        className="bg-transparent"
                        secureTextEntry={showPassword ? false : true}
                        left={<TextInput.Icon size={20} icon="lock" />}
                        onChangeText={setPassword}
                        right={
                            <TextInput.Icon
                                size={20}
                                icon="eye"
                                onPress={() => setShowPassword(!showPassword)}
                                icon={showPassword ? "eye-off" : "eye"}
                            />
                        }
                    />
                    <View className="pt-5">
                        <Button
                            onPress={() => validateInput()}
                            className=""
                            mode="contained"
                        >
                            Login
                        </Button>
                    </View>
                    <View className="flex-row items-center justify-center pt-5">
                        <Text>I Don't have an account</Text>
                        <Button onPress={() => router.push("singup")}>
                            Sing up
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PhoneLoginComponent;
