import React, { useState } from "react";
import { View, StyleSheet, Image, Modal } from "react-native";
import { Text, useTheme, Button, Appbar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import PhoneLoginComponent from "@/components/login/PhoneLoginComponent"
import EmailLoginComponent from "@/components/login/EmailLoginComponent"

const Index = () => {
    const theme = useTheme();
    const [loginOption, setLoginOption] = useState("");

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.colors.background }}
        >
            <Appbar>
                <Button mode="">Help</Button>
            </Appbar>
            
            <View className="absolute top-[120px] space-y-5 w-full items-center justify-center">
                <Image
                    className="h-14 w-14  rounded-full"
                    source={require("../assets/images/profile_avatar.png")}
                />
                <View className="items-center">
                    <Text
                        style={{
                            color: theme.colors.onBackground,
                            fontSize: 20
                        }}
                    >
                        Welcome To AppName
                    </Text>
                    <Text
                        style={{
                            color: theme.colors.onBackground,
                            fontSize: 13,
                            marginBottom: 30,
                            opacity: 0.5
                        }}
                    >
                        App description here
                    </Text>
                </View>
            </View>
            <View
                className="h-[50%] w-screen justify-center rounded-t-[40px]"
                style={{
                    position: "absolute",
                    bottom: 0,
                    marginTop: 10,
                    paddingBottom: 30,
                    backgroundColor: theme.colors.surfaceVariant
                }}
            >
                <View className="space-y-5 px-7 shadow-2xl">
                    <Button
                        onPress={() => setLoginOption("Email")}
                        icon="account"
                        mode="outlined"
                    >
                        Login With Email
                    </Button>
                    <Button
                        onPress={() => setLoginOption("Phone")}
                        className=""
                        buttonColor="gray"
                        textColor="white"
                        icon="phone"
                        mode="contained"
                    >
                        Login with phone
                    </Button>
                    <Button
                        onPress={() => alert('Social login not avilable. login with email instead')}
                        textColor="#ff6868"
                        icon="google"
                        mode="outlined"
                    >
                        Login With Google
                    </Button>
                    <View className="flex-row items-center justify-center">
                        <Text>I Don't have an account</Text>
                        <Button onPress={() => router.push("singup")}>Sing up</Button>
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                onRequestClose={() => setLoginOption("")}
                visible={loginOption ? true : false}
            >
                {loginOption == "Email" && <EmailLoginComponent />}
                {loginOption == "Phone" && <PhoneLoginComponent />}
            </Modal>
        </SafeAreaView>
    );
};

export default Index;
