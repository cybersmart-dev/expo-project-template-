import { View, Text, BackHandler } from "react-native";
import React, { use, useCallback } from "react";
import EmailLoginComponent from "@/components/login/EmailLoginComponent";
import { router, useFocusEffect } from "expo-router";

const emailLogin = () => {
  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        router.push("/");
        return true;
      });

      return () => back.remove();
    }, []),
  );

  return <EmailLoginComponent />;
};

export default emailLogin;
