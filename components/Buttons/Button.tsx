import { View, Text, GestureResponderEvent } from "react-native";
import React from "react";
import { ActivityIndicator, Button as RNFButton } from "react-native-paper";

interface ButtonProps {
  children?: React.ReactNode;
  loading?: boolean;
   onPress?: ((e: GestureResponderEvent) => void) | undefined
}
const Button = ({ children, loading, onPress }: ButtonProps) => {
  return (
    <View className="">
      {loading && (
        <RNFButton
          disabled
          className="text-lg py-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="contained"
        >
          <View className="flex-row">
            <Text> </Text>
            <ActivityIndicator size={25} />
          </View>
        </RNFButton>
      )}

      {!loading && (
        <RNFButton
          onPress={onPress}
          mode={"contained"}
          className="py-1"
          style={{ borderRadius: 15 }}
          labelStyle={{
            fontSize: 16,
          }}
        >
          {children}
        </RNFButton>
      )}
    </View>
  );
};

export default Button;
