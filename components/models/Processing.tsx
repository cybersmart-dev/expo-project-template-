import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ProcessingProps {
  visible: boolean;
  description?: string;
}

const Processing = ({ visible, description }: ProcessingProps) => {
  const intervalRef = useRef(0);
  const cover1X = useSharedValue(0);
  const cover2X = useSharedValue(0);
  const coverContainerRotate = useSharedValue(0);

  return (
    <Modal transparent={true} visible={visible}>
      <SafeAreaView style={styles.container}>
        <View className="gap-y-5">
          <ActivityIndicator color="white" size={50} />
          {description && <Text className="text-white opacity-75">{description}</Text>}
          <Text style={{ fontSize: 20, textAlign: "center", color: "white" }}>
            Processing
          </Text>
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
    backgroundColor: "#1818189a",
  },
});

export default Processing;
