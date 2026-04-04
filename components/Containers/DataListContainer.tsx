import { View, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Chip, useTheme, Text } from "react-native-paper";
import { DataPackType } from "@/constants/Types";
import { formatNumber } from "@/constants/Formats";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import { EaseView } from "react-native-ease";
import { Timer } from "@/constants/Utils";

const BundlesList = {
  mtn: {
    networkId: 1,
    bundles: [
      {
        bundleType: "JustForYou",
        packs: [
          {
            id: 1,
            price: 700.0,
            validity: "7 days",
            benefits: "1.0GB",
          },
        ],
      },
      {
        bundleType: "Daily",
        packs: [
          {
            id: 1,
            price: 100.0,
            validity: "1 days",
            benefits: "100MB",
          },
          {
            id: 2,
            price: 200.0,
            validity: "1 days",
            benefits: "200MB",
          },
          {
            id: 3,
            price: 300.0,
            validity: "1 days",
            benefits: "300MB",
          },
          {
            id: 4,
            price: 1000.0,
            validity: "2 days",
            benefits: "600MB",
          },
        ],
      },
      {
        bundleType: "Monthly",
        packs: [
          {
            id: 1,
            price: 500,
            validity: "30 days",
            benefits: "500MB",
          },
        ],
      },
      {
        bundleType: "Weekly",
        packs: [
          {
            id: 1,
            price: 700.0,
            validity: "7 days",
            benefits: "1.0GB",
          },
        ],
      },
    ],
  },

  airtel: {
    networkId: 2,
    bundles: [
      {
        bundleType: "JustForYou",
        packs: [
          {
            id: 1,
            price: 700.0,
            validity: "7 days",
            benefits: "1.0GB",
          },
        ],
      },
    ],
  },

  glo: {
    networkId: 2,
    bundles: [
      {
        bundleType: "JustForYou",
        packs: [
          {
            id: 1,
            price: 700.0,
            validity: "7 days",
            benefits: "1.0GB",
          },
        ],
      },
    ],
  },

  "9mobile": {
    networkId: 2,
    bundles: [
      {
        bundleType: "JustForYou",
        packs: [
          {
            id: 1,
            price: 700.0,
            validity: "7 days",
            benefits: "1.0GB",
          },
        ],
      },
    ],
  },
};

interface DataPackComponentProps {
  item: DataPackType;
  selected: boolean;
  onPress: () => void;
}
const DataPackComponent = ({
  item,
  onPress,
  selected,
}: DataPackComponentProps) => {
  const theme = useTheme();
  const [clied, setClied] = useState(false)

  const handlePress = async () => {
    onPress()
    setClied(true)
    await new Timer().postDelayedAsync({sec: 300})
    setClied(false)

  }
  return (
    <View className="p-1 mt-2">
      <EaseView
        animate={{ scale: clied ? 0.5 : 1 }}
        transition={{type:'timing', duration: 700}}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: selected ? theme.colors.primary : "transparent",
            borderWidth: 1.5,
            borderStyle: "dotted",
            boxShadow: "0 3px 2px 2px rgba(0, 0, 0, 0.13)",
          }}
          className="h-[120px] py-5 w-[100px]  rounded-lg items-center justify-center"
        >
          <View className="bg-green-300 hidden w-full items-center p-1 absolute top-0 rounded-t-2xl">
            <Text numberOfLines={1} className="text-[10px]">
              <Text className="text-black">+ ₦ {formatNumber(0.4)}</Text>
            </Text>
          </View>
          <Text className="text-lg font-bold mt-3">{item.benefits}</Text>
          <Text>{item.validity}</Text>
          <Text className="text-[12px] mt-2">
            <Text className="font-bold">₦{formatNumber(item.price)}</Text>
          </Text>
        </TouchableOpacity>
      </EaseView>
    </View>
  );
};

interface DataListContainerProps {
  network?: "mtn" | "airtel" | "glo" | "9mobile";
  onPackSelect: (data: DataPackType) => void;
}
const DataListContainer = ({
  network = "mtn",
  onPackSelect,
}: DataListContainerProps) => {
  const [selectedBundle, setSelectedBundle] = useState("");
  const [selectedBundlePacks, setSelectedBundlePacks] =
    useState<Array<DataPackType>>();
  const [selectedNetwork, setSelectedNetwork] = useState<{
    networkId: number;
    bundles: Array<{
      bundleType: string;
      packs: Array<DataPackType>;
    }>;
  }>();
  const [selectedPack, setSelectedPack] = useState<DataPackType>();

  useEffect(() => {
    handleNetworkSelect();
  }, [network]);

  const handleNetworkSelect = () => {
    const selected = BundlesList[network];
    setSelectedNetwork(selected);
    if (selected.bundles.length > 0) {
      setSelectedBundle(selected.bundles[0].bundleType);
      setSelectedBundlePacks(selected.bundles[0].packs);
    }
  };

  return (
    <View className="w-full h-auto">
      <View className="flex-row items-center justify-around mt-5 px-2">
        <FlatList
          keyExtractor={(item) => item.bundleType}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={selectedNetwork?.bundles}
          renderItem={({ item }) => (
            <View className="p-1 mr-3 pr-1">
              <Chip
                selected={true ? item.bundleType == selectedBundle : false}
                onPress={() => {
                  setSelectedBundle(item.bundleType);
                  setSelectedBundlePacks(item.packs);
                }}
              >
                {item.bundleType}
              </Chip>
            </View>
          )}
        />
      </View>
      <View className="px-3 space-x-1 mt-1 h-[290px]">
        <FlatList
          keyExtractor={(item) => `${item.id}`}
          numColumns={3}
          data={selectedBundlePacks}
          renderItem={({ item }) => (
            <DataPackComponent
              selected={
                `${item.id}|${item.benefits}` ==
                `${selectedPack?.id}|${selectedPack?.benefits}`
              }
              onPress={() => {
                setSelectedPack(item);
                onPackSelect(item);
              }}
              item={item}
            />
          )}
        />
      </View>
    </View>
  );
};

export default DataListContainer;
