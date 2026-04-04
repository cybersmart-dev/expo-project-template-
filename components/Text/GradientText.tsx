import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue } from "react-native";
import { Text, TextProps } from "react-native-paper";


interface GradientTextProps {
    children: React.ReactNode;
    colors: readonly [ColorValue, ColorValue, ...ColorValue[]]
    className?: string | undefined
}
export default function GradientText({children, colors, className}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text className={"text-4xl font-bold"}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
              <Text className={"text-4xl font-bold opacity-0"}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}