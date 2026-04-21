import { View, Text, BackHandler } from "react-native";
import React, { useCallback } from "react";
import PhoneLoginComponent from "@/components/login/PhoneLoginComponent";
import { router, useFocusEffect } from "expo-router";

const phoneLogin = () => {
   useFocusEffect(
      useCallback(() => {
        const back = BackHandler.addEventListener("hardwareBackPress", () => {
          router.push("/");
          return true;
        });
  
        return () => back.remove();
      }, []),
    );
  return <PhoneLoginComponent />;
};

export default phoneLogin;
