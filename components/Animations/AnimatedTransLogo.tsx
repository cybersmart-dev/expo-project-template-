import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { EaseView } from "react-native-ease";
import { Image } from "react-native";
import { useFocusEffect } from "expo-router";

const AnimatedTransLogo = () => {
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoaded(true);
      return () => {
        setLoaded(false);
      };
    }, []),
  );
  return (
    <EaseView
      animate={{ scale: loaded ? 1 : 0 }}
      transition={{ type: "timing", duration: 1000 }}
    >
      <Image
        className="h-[100px] w-[100px]  rounded-full"
        source={require("@/assets/images/icon_trans.png")}
      />
    </EaseView>
  );
};

export default AnimatedTransLogo;

const styles = StyleSheet.create({});
