import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper"
const BalanceContainer = ({ user, theme }) => {
    return (
        <View
            style={{ backgroundColor: theme.colors.surfaceVariant }}
            className="relative h-36 w-full rounded-lg mt-2 p-2"
        >
            <View>
                <Text className="text-2xl font-bold">10,000.00 NGN</Text>
            </View>
            <View className="absolute p-2 bottom-0 right-0 m-1">
                <Button mode="contained" icon="plus">
                    Add Money
                </Button>
            </View>
        </View>
    );
};

export default BalanceContainer;
