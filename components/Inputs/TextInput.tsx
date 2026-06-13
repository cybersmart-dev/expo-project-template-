import { View, Text, TextInputSubmitEditingEvent } from "react-native";
import React from "react";
import { HelperText, TextInput as RNFTextInput } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface TextInputProps {
  secureTextEntry?: boolean | undefined;
  error?: boolean | undefined;
  left?: IconSource;
  onChangeText?: (((text: string) => void) & Function) | undefined;
  disabled?: boolean | undefined;
  onSubmitEditing?: ((e: TextInputSubmitEditingEvent) => void) | undefined;
  right?: IconSource;
  placeholder?: string | undefined;
  errorMessage?: string;
}
const TextInput = ({
  secureTextEntry,
  error,
  left,
  onChangeText,
  disabled,
  onSubmitEditing,
  right,
  placeholder,
  errorMessage,
}: TextInputProps) => {
  return (
    <View>
      <RNFTextInput
        placeholder={placeholder}
        style={{ backgroundColor: "transparent" }}
        secureTextEntry={secureTextEntry}
        error={error}
        left={
          left ? (
            <RNFTextInput.Icon size={20} onPress={() => {}} icon={left} />
          ) : (
            ""
          )
        }
        onChangeText={onChangeText}
        disabled={disabled}
        onSubmitEditing={onSubmitEditing}
        right={
          right ? (
            <RNFTextInput.Icon size={20} onPress={() => {}} icon={right} />
          ) : (
            ""
          )
        }
        mode="outlined"
        outlineStyle={{ borderRadius: 15 }}
      />

      <HelperText type={"error"} visible={error}>
        {errorMessage}
      </HelperText>
    </View>
  );
};

export default TextInput;
