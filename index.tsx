import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const App = () => {
    return (
        <View style={styles.container}>
            <Text>Hello World</Text>
            <Button title='Press Me'/>
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

export default App;
