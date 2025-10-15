import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PaperViewProps {
    children:React.ReactNode
}
const PaperView:React.FC<PaperViewProps> = ({children}) => {
    return (
        <View style={styles.container}>
            {children}
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

export default PaperView;
