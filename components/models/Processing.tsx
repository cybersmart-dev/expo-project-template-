import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ProcessingProps {
  visible: boolean;
}

const Processing = ({ visible }: ProcessingProps) => {
  const intervalRef = useRef(0);
  const cover1X = useSharedValue(0);
  const cover2X = useSharedValue(0);
  const coverContainerRotate = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      cover1X.value = 0;
      cover2X.value = 0;
      coverContainerRotate.value = 0;
    }
  }, [visible]);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      cover2X.value -= 1;
      cover1X.value += 1;

        if (cover2X.value <= -30) {
          cover2X.value += 1;
      }

        if (cover1X.value >= 30) {
          cover1X.value -= 1;
      }
    }, 10);
  };
  const cover1XAnimatedSyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(cover1X.value) }],
    };
  });

  const coverContainerAnimetedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${coverContainerRotate.value.toString()}deg` }],
    };
  });

  const cover2XAnimatedSyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(cover2X.value) }],
    };
  });
  return (
    <Modal transparent={true} visible={visible}>
      <SafeAreaView className="bg-[#1818189a]" style={styles.container}>
        <View className="gap-y-5">
          <ActivityIndicator size={50} />
          <Text style={{fontSize: 20}}>Processing...</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Processing;
