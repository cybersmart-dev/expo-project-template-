import { View, Text } from "react-native";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

interface CustomAppbarProps {
  children: React.ReactNode;
}
const CustomAppbar = ({ children }: CustomAppbarProps) => {
    const theme = useTheme()
  return <Appbar style={{backgroundColor: "transparent"}}>{children}</Appbar>;
};

export default CustomAppbar;
