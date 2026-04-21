import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, DimensionValue } from "react-native";
//import * as Clipboard from "expo-clipboard";
import { useTheme } from "react-native-paper";
/**
 * OtpInput
 *
 * Props:
 *  - length (number) default 6
 *  - onComplete(code: string) called when all boxes filled
 *  - autoFocus (bool) default true
 *  - containerStyle / inputStyle can be passed as className strings (NativeWind) or plain style objects
 */

interface OtpInputProps {
  length?: number | undefined;
  onComplete?: ((digit: string) => void) | undefined;
  onChange?: ((digit: string) => void) | undefined;
  autoFocus?: boolean | undefined;
  error?: boolean | undefined;
  containerClassName?: string | undefined;
  inputClassName?: string | undefined;
  value?: string | undefined;
  height?: DimensionValue | undefined
  width?: DimensionValue | undefined
  editable?: boolean | undefined
  
  
}
export default function OtpInput({
  height = 40,
  width = 40,
  length = 6,
  onComplete = () => {},
  onChange = () => {},
  autoFocus = true,
  error = false,
  containerClassName = "flex-row justify-center items-center",
  inputClassName = "",
  value = "",
  editable
}: OtpInputProps) {
  const [digits, setDigits] = useState(Array(length).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const mountedRef = useRef(false);
  const theme = useTheme();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    handleChange(value, 0);
  }, [value]);

  useEffect(() => {
    // If all digits filled call onComplete
    onChange(digits.join(""));
    if (digits.every((d) => d !== "")) {
      onComplete(digits.join(""));
    }
  }, [digits, onComplete]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (text:string, idx:number) => {
    // If user pasted string (length > 1)
    if (text.length > 1) {
      const chars = text
        .replace(/\s+/g, "")
        .split("")
        .slice(0, length - idx);
      setDigits((prev) => {
        const updated = [...prev];
        for (let i = 0; i < chars.length; i++) {
          updated[idx + i] = chars[i];
        }
        return updated;
      });

      const nextIndex = Math.min(length - 1, idx + text.length - 1);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    // Normal single char input
    const char = text.replace(/[^0-9]/g, ""); // allow only digits
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = char;
      return next;
    });

    if (char !== "") {
      // move focus to next
      const next = idx + 1;
      if (next < length) inputsRef.current[next]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }:any , idx:any) => {
    if (nativeEvent.key === "Backspace") {
      if (digits[idx] === "") {
        // move to previous if current is empty
        const prev = idx - 1;
        if (prev >= 0) {
          inputsRef.current[prev]?.focus();
          setDigits((prevArr) => {
            const copy = [...prevArr];
            copy[prev] = "";
            return copy;
          });
        }
      } else {
        // clear current
        setDigits((prevArr) => {
          const copy = [...prevArr];
          copy[idx] = "";
          return copy;
        });
      }
    }
  };

  const handlePaste = async (idx:number) => {
    // Some devices/OS allow paste event on TextInput. Use Clipboard as fallback.
    const text:string = ""; //await Clipboard.getStringAsync();
    alert(text);
    if (!text) return;
    const chars = text
      .replace(/\s+/g, "")
      .split("")
      .slice(0, length - idx);
    setDigits((prev) => {
      const updated = [...prev];
      for (let i = 0; i < chars.length; i++) {
        updated[idx + i] = chars[i];
      }
      return updated;
    });
    const nextIndex = Math.min(length - 1, idx + chars.length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "auto",
      }}
      className=""
    >
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputsRef.current[i] = ref)}
          value={digits[i]}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          editable={editable}
          keyboardType="number-pad"
          secureTextEntry={true}
          maxLength={1}
          style={{
            borderColor: error ? theme.colors.error : "gray",
            borderWidth: 1,
            width: width,
            height: height,
            color: theme.colors.onBackground,
          }}
          returnKeyType="done"
         
          textContentType="oneTimeCode" // helps iOS auto-fill
          className="text-white text-center mx-1 bg-transparent rounded-lg  "
          mode="outlined"
          onFocus={() => {
            // select content on focus for easier replace
            inputsRef.current[i]?.setNativeProps?.({
              selection: { start: 0, end: 1 },
            });
          }}
          onLongPress={() => handlePaste(i)}
          // If you prefer a visible fallback button for paste:
          // You can add a TouchableOpacity next to inputs that calls handlePaste(0)
        />
      ))}
    </View>
  );
}
