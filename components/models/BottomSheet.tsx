import {
  View,
  Text,
  Modal,
  DimensionValue,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, useTheme } from "react-native-paper";

interface BottomSheetProps {
  visible?: boolean;
  children: React.ReactNode;
  height?: DimensionValue | undefined;
  onDismiss?: () => void;
  dismissable?: boolean;
  mode?: "center" | "full-width";
}

const BottomSheet = ({
  children,
  onDismiss = () => {},
  dismissable = true,
  visible = true,
  height = "auto",
  mode = "center",
}: BottomSheetProps) => {
  const theme = useTheme();

  const dismiss = () => {
    Keyboard.dismiss();
    if (dismissable) {
      onDismiss();
    }
  };
  return (
    <Modal
      animationType="fade"
      onRequestClose={dismiss}
      visible={visible}
      transparent
    >
      <Pressable onPress={dismiss} className="bg-[#1818189a] flex-1 ">
        <View
          style={{ height: height }}
          className={
            mode == "center"
              ? "absolute bottom-0 w-full pb-4 px-4 "
              : "absolute bottom-0 w-full"
          }
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <Pressable
              onPress={() => Keyboard.dismiss()}
              className={
                mode == "center"
                  ? "h-full w-full bg-white rounded-2xl"
                  : "h-full w-full bg-white rounded-t-2xl"
              }
            >
              <View className="w-full items-center pt-1">
                <View
                  style={{ backgroundColor: theme.colors.primary }}
                  className="h-[5px] w-[70px] rounded-full"
                ></View>
              </View>
              {children}
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default BottomSheet;
