import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Text } from "react-native-paper";

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["C", "0", "⌫"],
];

interface KeypadProps {
  onChange?: (digit: string) => void;
  onDelete?: () => void;
  onClear?: () => void;
}
export default function Keypad({ onChange, onDelete, onClear }: KeypadProps) {
  const handlePress = (key: string) => {
    if (key === "⌫") {
      if (onDelete) {
        onDelete();
      }
      return;
    }
    if (key == "C") {
      if (onClear) {
        onClear();
      }
      return;
    }
    if (onChange) {
      onChange(key);
    }
  };

  return (
    <View className="flex-1  bg-black justify-center items-center px-5">
      {/* Display */}

      {/* Keypad */}
      <View className="w-full space-y-20">
        {keys.map((row, i) => (
          <View key={i} className="flex-row  justify-between mb-4">
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={{ boxShadow: "0 1px 5px 2px rgba(0, 0, 0, 0.20)" }}
                onPress={() => handlePress(key)}
                activeOpacity={0.7}
                className={` mx-1 h-16 w-16 rounded-full justify-center items-center 
                  ${key === "⌫" ? "bg-red-500" : "bg-transparent"}`}
              >
                <Text className="text-2xl font-semibold">{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
