import { View, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import CustomAppbar from "@/components/CustomAppbar";
import { Appbar, MD3Theme, useTheme, Text } from "react-native-paper";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "@/components/Buttons/Button";
import { ScrollView } from "react-native";

const TiersList = [
  {
    id: 1,
    name: "Tier 1",
    description: "",
    requirements: ["", ""],
    benefits: ["", ""],
  },
  {
    id: 2,
    name: "Tier 2",
    description: "",
    requirements: ["", ""],
    benefits: ["", ""],
  },
  {
    id: 3,
    name: "Tier 3",
    description: "",
    requirements: ["", ""],
    benefits: ["", ""],
  },
];

interface TierComponentProp {
  theme: MD3Theme;
  tier: (typeof TiersList)[0];
  currentLevel: any;
}
const TierComponent = ({ theme, tier, currentLevel }: TierComponentProp) => {
  return (
    <Pressable
      style={{ backgroundColor: theme.colors.primaryContainer }}
      className="h-40 w-full rounded-2xl"
      key={tier.id}
    >
      <View className="w-full px-3 mt-3 flex-row items-center justify-between">
        <View
          style={{ backgroundColor: theme.colors.surfaceVariant }}
          className="h-5 rounded-full px-2"
        >
          <Text>{tier.name}</Text>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            display: currentLevel == tier.id ? "contents" : "none",
          }}
          className="h-5 rounded-full  px-2"
        >
          <Text>Current</Text>
        </View>
      </View>
    </Pressable>
  );
};
interface AvailableTiersProps {
  theme: MD3Theme;
  currentLevel: any;
}
const AvailableTiers = ({ theme, currentLevel }: AvailableTiersProps) => {
  return (
    <View className="mt-5 px-5 gap-y-5 mb-5">
      <Text className="font-bold text-lg">All Tiers</Text>
      {TiersList.map((tier) => (
        <TierComponent
          currentLevel={currentLevel}
          key={`${tier.id}`}
          theme={theme}
          tier={tier}
        />
      ))}
    </View>
  );
};

const Tiers = () => {
  const theme = useTheme();
  const [userCurrentLevelId, setUserCurrentLevelId] = useState(3);

  const handleTierUpgradePress = useCallback(() => {
    const tier = TiersList.find((tier) => tier.id == userCurrentLevelId);
    if (tier?.name?.match("0")) {
      router.push("/AccountUpgrade/Tier1Upgrade");
    }
    if (tier?.name?.match("1")) {
      router.push("/AccountUpgrade/Tier2Upgrade");
    }
    if (tier?.name?.match("2")) {
      router.push("/AccountUpgrade/Tier3Upgrade");
    }
  }, [userCurrentLevelId]);

  return (
    <PaperSafeView>
      <CustomAppbar>
        <Appbar.Action
          onPress={() => router.back()}
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />
        <Appbar.Content
          color="white"
          title={<Text className="text-lg font-bold">Account Tiers</Text>}
        />
      </CustomAppbar>

      <View style={{ flex: 1 }} className="">
        <View className="px-5 gap-y-3">
          <View
            style={{ backgroundColor: theme.colors.primary }}
            className="h-52 w-full rounded-2xl"
          >
            <View
              
              className="h-5 rounded-full px-2 mt-3"
            >
              <Text style={{color: "white", fontSize: 17}}>{"Tier 0"}</Text>
            </View>
          </View>
          <Button
            onPress={handleTierUpgradePress}
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-up"
                size={size}
                color={color}
              />
            )}
          >
            Upgrade to Tier 1
          </Button>
        </View>

        <ScrollView className="">
          <AvailableTiers currentLevel={userCurrentLevelId} theme={theme} />
        </ScrollView>
      </View>
    </PaperSafeView>
  );
};

export default Tiers;
