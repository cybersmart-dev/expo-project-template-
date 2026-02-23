import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Text } from "react-native-paper";

const Processing = ({ visible }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <SafeAreaView className="bg-[#1818189a]" style={styles.container}>
                <View className="space-y-2">
                    <ActivityIndicator />
                    <Text className="text-white">Processing...</Text>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Processing;
