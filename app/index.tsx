import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import { useFonts } from "expo-font";
import { useSharedValue } from "react-native-reanimated";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get("screen");
const Index = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const progressBar = useSharedValue(0);

    const [progress, setProgress] = React.useState(0.0);
    const updateProgress = () => {
        const loop = () => {
            progressBar.value += 0.01;

            if (progressBar.value >= 1) {
                navigation.navigate("(tabs)");
                setProgress(0);
            }
            setProgress(progressBar.value);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };
    React.useEffect(() => {
        updateProgress();
        return () => {};
    }, []);
    return (
        <View style={styles.container}>
            <Text
                style={{
                    color: theme.colors.background,
                    fontSize: 30,
                    marginBottom: 30
                }}
            >
                Custom FlashScreen
            </Text>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 30
                }}
            >
                <ProgressBar
                    visible={true}
                    progress={progress}
                    style={{ height: 7, width: width / 1.5, borderRadius: 10 }}
                />
                <Text style={{ color: "black", marginTop: 10 }}>
                    Please Wait
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Index;
