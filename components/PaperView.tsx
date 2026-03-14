import React from "react";
import { View, Text, StyleSheet, ViewStyle, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from 'react-native-paper'


interface PaperViewProps {
    children: React.ReactNode,
    
}
export const PaperView:React.FC<PaperViewProps> = ({children}) => {
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

interface PaperSafeViewProps {
    children: React.ReactNode,
    className?: string,
    style?: ViewStyle, 
    onPress?: () => void
    
}

export const PaperSafeView: React.FC<PaperSafeViewProps> = ({ children,className, style, onPress }) => {
    const theme = useTheme()
    return (
        <SafeAreaView className="flex-1" style={[{backgroundColor: theme.colors.background}, style]}>
            <Pressable onPress={onPress} className={className || "flex-1"}>
                {children}
            </Pressable>
        </SafeAreaView>
    );
};



