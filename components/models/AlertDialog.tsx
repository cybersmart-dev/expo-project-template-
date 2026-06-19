import { View, Text, StatusBar as RNStatusBar, DimensionValue, ColorValue } from "react-native";
import React, { useCallback } from "react";
import { Modal, Portal, useTheme } from "react-native-paper";

interface AlertDialogProps {
  children?: React.ReactNode;
  visible: boolean;
  onDismiss?: (value: boolean) => void;
  height?: DimensionValue | undefined
  backgroundColor?: ColorValue | undefined
}
const AlertDialog = ({ visible, children, onDismiss, height = "auto", backgroundColor }: AlertDialogProps) => {
  const theme = useTheme();
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(false);
    }
  }, []);

  return (
    <Portal>
      <Modal onDismiss={handleDismiss} visible={visible}>
        <View className="w-screen px-5">
          <View
            style={{
              height: height,
              minHeight:200,
              backgroundColor: backgroundColor ? backgroundColor :  theme.colors.background,
            }}
            className="w-full rounded-2xl p-2"
          >
            {children}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default AlertDialog;
