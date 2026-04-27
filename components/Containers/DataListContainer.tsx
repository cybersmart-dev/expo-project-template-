import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Chip,
  useTheme,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { DataPackType } from "@/constants/Types";
import { formatNumber } from "@/constants/Formats";
import { CustomLightTheme } from "@/Themes/ThemeSchemes";
import { EaseView } from "react-native-ease";
import { Timer } from "@/constants/Utils";
import { Image } from "expo-image";
import requests from "@/Network/HttpRequest";

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
  const [clied, setClied] = useState(false);

  const handlePress = async () => {
    onPress();
    setClied(true);
    await new Timer().postDelayedAsync({ sec: 300 });
    setClied(false);
  };
  return (
    <View className="p-1 mt-2">
      <EaseView
        animate={{ scale: clied ? 0.5 : 1 }}
        transition={{ type: "timing", duration: 700 }}
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
  network: "mtn" | "airtel" | "glo" | "9mobile" | undefined;
  networkId?: number;
  onPackSelect: (data: DataPackType) => void;
  onPressSelectNetwork?: () => void;
}
const DataListContainer = ({
  network,
  networkId,
  onPackSelect,
  onPressSelectNetwork,
}: DataListContainerProps) => {
  const [selectedBundle, setSelectedBundle] = useState("");
  const [networkRequestFailed, setNetworkRequestFailed] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [dataBundles, setDataBundles] = useState<Array<any>>([]);
  const [selectedPack, setSelectedPack] = useState<DataPackType>();
  const [dataPlans, setDataPlans] = useState<Array<any>>([]);
  const [selectedBundleName, setSelectedBundleName] = useState("");

  useEffect(() => {
    if (network) {
      setDataBundles([]);
      setDataPlans([]);
      setSelectedBundleName("")
      fetchDataPlans();
    }
  }, [network, networkId]);

  useEffect(() => {
    if (dataBundles[0]?.name) {
      setDataPlans(dataBundles[0].plans);
      setSelectedBundleName(dataBundles[0].name);
    }
  }, [dataBundles]);

  const fetchDataPlans = async () => {
    setNetworkRequestFailed(false);
    setFetchingPlans(true);
    const response = await requests.get({
      url: `/data-plans/?id=${networkId}`,
    });

    setFetchingPlans(false);

    if (response.status == 1) {
      setDataBundles(response?.data?.categories);
    }

    if (response.status == 0) {
      // do something
    }

    if (response.status == undefined) {
      setNetworkRequestFailed(true);
    }
  };

  return (
    <View className="w-full h-auto">
      <View className="flex-row items-center justify-around mt-5 px-2">
        <FlatList
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dataBundles}
          renderItem={({ item }) => (
            <View className="p-1 mr-3 pr-1">
              <Chip
                selected={true ? item.name == selectedBundleName : false}
                onPress={() => {
                  setSelectedBundleName(item.name);
                  setDataPlans(item.plans);
                }}
              >
                {item.name}
              </Chip>
            </View>
          )}
        />
      </View>
      <View className="px-3 space-x-1 mt-1 h-[290px]">
        <FlatList
          keyExtractor={(item) => `${item.id}`}
          numColumns={3}
          data={dataPlans}
          refreshControl={<RefreshControl refreshing={false} onRefresh={fetchDataPlans} />}
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
          ListEmptyComponent={() =>
            !fetchingPlans && !networkRequestFailed && (
              <View className="h-full items-center justify-center w-full pt-5">
                <Image
                  className="h-20 w-20 rounded-full"
                  source={require("@/assets/images/gif/no_transactions_anim.webp")}
                />

                <Text className="mt-3">
                  <Text className="font-bold">' {network?.toUpperCase() +' '+ selectedBundleName} '</Text> data plans not available currently
                </Text>
                <Button
                  onPress={fetchDataPlans}
                  mode={"contained-tonal"}
                  className="mt-4"
                >
                  Reload
                </Button>
              </View>
            )
          }
        />
        {networkRequestFailed && (
          <View className="h-full items-center justify-center w-full">
            <Image
              className="h-28 w-24 rounded-full"
              source={require("@/assets/images/gif/no_connection_anim2.gif")}
            />

            <Text className="font-bold">No Connection!</Text>
            <Button
              onPress={fetchDataPlans}
              mode={"contained-tonal"}
              className="mt-4"
            >
              Reload
            </Button>
          </View>
        )}

        {fetchingPlans && (
          <View className="h-full items-center justify-center w-full">
            <View className="space-y-3 items-center">
              <ActivityIndicator size={30} />
              <Text className="font-bold">Loading Plans...</Text>
            </View>
          </View>
        )}

        {!network && (
          <View className="h-full items-center justify-center w-full">
            <View className="space-y-3 items-center w-full">
              <Text className="font-bold w-full text-center uppercase">Select network first!</Text>
              <Button onPress={onPressSelectNetwork} mode={"contained-tonal"}>
                Select Now
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DataListContainer;
