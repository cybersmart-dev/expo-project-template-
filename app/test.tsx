import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { FAB, List, Appbar, useTheme,Text } from "react-native-paper";
import Animated,{useSharedValue} from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const FabAnimated = Animated.createAnimatedComponent(FAB)

const messages = [];
for (let i = 0; i < 100; i++) {
    messages.push({
        id: i,
        title: "This is simple title"
    });
}

export default function App() {
    const [label, setLabel] = useState("");
    const theme = useTheme()
    
    const handlePress = () => {
        console.log(Animated)
    };
    
    const handleScroll = event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= 0) {
            setLabel("");
            return;
        }
        setLabel("Add New");
    };
    return (
        <SafeAreaView style={{ backgroundColor: theme.colors.background,}}  className="h-screen flex-1">
            <Appbar>
                <Appbar.Content title="Example" />
            </Appbar>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.title}
                        className="px-3"
                        onPress={() => null}
                        left={() => <List.Icon icon="account" />}
                        right={() => <Text>{item.id}</Text>}
                    />
                )}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={() => null}
            />
            <FabAnimated
                onPress={() => handlePress()}
                label={label}
                icon="account-plus"
                className="absolute bottom-0 right-0 mb-5 mr-5"
            />
        </SafeAreaView>
    );
}
