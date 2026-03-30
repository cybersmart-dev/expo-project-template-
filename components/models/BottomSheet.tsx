import {
  View,
  Modal,
  DimensionValue,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ViewStyle,
  StatusBar as RNStatusBar,
  ColorValue,
} from "react-native";
import React, { SetStateAction } from "react";
import { useTheme } from "react-native-paper";
import {
  createAnimatedComponent,
  FadingTransition,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";
import { EaseView } from "react-native-ease";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedKeyboardAvoidingView =
  createAnimatedComponent(KeyboardAvoidingView);

interface BottomSheetProps {
  visible?: boolean;
  children: React.ReactNode;
  height?: DimensionValue | undefined;
  onDismiss?: (value: SetStateAction<boolean>) => void;
  dismissable?: boolean;
  mode?: "center" | "full-width" | "dailog";
  style?: ViewStyle;
  animationType?: "fade" | "none" | "slide" | undefined;
  backgroundColor?: ColorValue;
}

const BottomSheet = ({
  children,
  style,
  onDismiss = (value = false) => {},
  dismissable = true,
  visible = true,
  height = "auto",
  mode = "center",
  animationType = "fade",
  backgroundColor,
}: BottomSheetProps) => {
  const theme = useTheme();

  const dismiss = () => {
    Keyboard.dismiss();
    if (dismissable) {
      onDismiss(false);
    }
  };
  const getModeStyle = (): { main: string; shape: string } => {
    if (mode == "center") {
      return {
        main: "absolute bottom-0 w-full pb-4 px-4",
        shape: "h-full w-full rounded-2xl",
      };
    }
    if (mode == "full-width") {
      return {
        main: "absolute bottom-0 w-full",
        shape: "h-full w-full rounded-t-2xl",
      };
    }
    if (mode == "dailog") {
      return {
        main: "absolute bottom-[50%] w-full  px-4 ",
        shape: "h-full w-full rounded-2xl",
      };
    }
    return {
      main: "",
      shape: "",
    };
  };
  return (
    <Modal
      animationType={animationType}
      onRequestClose={dismiss}
      visible={visible}
      style={style}
      transparent
    >
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        <AnimatedKeyboardAvoidingView
          className="bg-[#1818189a] flex-1 "
          behavior={Platform.OS == "android" ? "padding" : "height"}
        >
          <Pressable
            style={{
              marginTop: mode == "dailog" ? RNStatusBar.currentHeight : 0,
            }}
            onPress={dismiss}
            className="flex-1 "
          >
            <EaseView
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: 4000, type: "timing" }}
              style={{ height: height }}
              className={getModeStyle().main}
            >
              <Pressable
                onPress={() => Keyboard.dismiss()}
                style={{
                  backgroundColor:
                    backgroundColor != undefined
                      ? backgroundColor
                      : theme.colors.background,
                }}
                className={getModeStyle().shape}
              >
                <View className="w-full items-center pt-1">
                  {mode != "dailog" && (
                    <View
                      style={{ backgroundColor: theme.colors.primary }}
                      className="h-[5px] w-[70px] rounded-full"
                    ></View>
                  )}
                </View>
                {children}
              </Pressable>
            </EaseView>
          </Pressable>
        </AnimatedKeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default BottomSheet;
