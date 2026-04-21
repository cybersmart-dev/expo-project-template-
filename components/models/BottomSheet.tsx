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
  LayoutChangeEvent,
  Dimensions
} from "react-native";
import React, { SetStateAction, useState, useEffect } from "react";
import { FAB, useTheme } from "react-native-paper";
import {
  createAnimatedComponent,
  FadingTransition,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";
import { EaseView } from "react-native-ease";
import { SafeAreaView } from "react-native-safe-area-context";

const screen = Dimensions.get('screen')

const AnimatedKeyboardAvoidingView =
  createAnimatedComponent(KeyboardAvoidingView);

interface BottomSheetProps {
  visible?: boolean;
  children: React.ReactNode;
  outterChildren?: React.ReactNode
  outterChildrenStyle?: ViewStyle
  outterChildrenSpace?: number
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
  outterChildren,
  outterChildrenStyle,
  outterChildrenSpace = 70
}: BottomSheetProps) => {
  const theme = useTheme();
  const [formHeight, setFormHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
        main: "absolute bottom-[37.5%] w-full  px-4 ",
        shape: "h-full w-full rounded-2xl",
      };
    }
    return {
      main: "",
      shape: "",
    };
  };
   const handleOnLayout = (event: LayoutChangeEvent): void => {
     const height = event.nativeEvent.layout.height;
      setFormHeight(height);
    };
  return (
    <Modal
      animationType={animationType}
      onDismiss={dismiss}
      visible={visible}
      style={style}
      
      transparent
      
    >
      <SafeAreaView edges={['bottom', 'left', 'right']} className="bg-[#1818189a] flex-1">
        <View pointerEvents="box-none" style={[{ transform:[{translateY: screen.height - formHeight - outterChildrenSpace}] }, outterChildrenStyle]} className="px-5 block w-auto z-50">
          {outterChildren}
        </View>
        <Pressable
           
          style={{
            marginTop: mode == "dailog" ? RNStatusBar.currentHeight : 0,
          }}
          onPress={dismiss}
          className="flex-1"
         // pointerEvents="box-none"
        >
          <EaseView
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 4000, type: "timing" }}
            style={{ height: height, bottom: keyboardHeight }}
            className={getModeStyle().main}
          >
            <Pressable
              onPress={() => Keyboard.dismiss()}
              onLayout={handleOnLayout}
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
              <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                {children}
              </KeyboardAvoidingView>
            </Pressable>
          </EaseView>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

export default BottomSheet;
