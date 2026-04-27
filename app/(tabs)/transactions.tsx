import { View, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  List,
  useTheme,
  Text,
  Chip,
  ActivityIndicator,
  Button,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Transactions } from "@/constants/DemoList";
import { formatNumber, getTransactionSideFormat } from "@/constants/Formats";
import { Image } from "expo-image";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";

interface TransactionsListComponentProps {
  id?: number;
  side: string;
  title: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  status?: string;
  onPress: () => void;
}
const TransactionsListComponent = ({
  side,
  title,
  type,
  description,
  date,
  amount,
  status,
  onPress,
}: TransactionsListComponentProps) => {
  const getState = () => {
   
  };
  return (
    <List.Item
      title={
        <View className="flex-row items-center space-x-1">
          <Text className="font-bold">{title}</Text>
          <Text className="text-[10px]">{status}</Text>
        </View>
      }
      onPress={onPress}
      descriptionNumberOfLines={1}
      description={description}
      right={() => (
        <View className="items-end justify-evenly">
          <Text style={{ color: getTransactionSideFormat(side, amount).color }} className="text-green-600">
            {" "}
            {getTransactionSideFormat(side, amount).format}
          </Text>
          <Text className="text-[10px] opacity-75">{date}</Text>
        </View>
      )}
    />
  );
};

const services = [
  "All",
  "Data",
  "Airtime",
  "Electricity",
  "Betting",
  "Deposit",
];

const transactions = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<any>([]);
  const [fetching, setFetching] = useState(false);
  const [networkDisconnected, setNetworkDisconnected] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [networkRequestFailed, setNetworkRequestFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [selectedService]),
  );

  const fetchTransactions = async () => {
    setFetching(true);
    const response = await requests.get({
      url: `/user/transactions/?service_type=${selectedService.toUpperCase()}`,
    });

    setFetching(false);

    if (response.status == 1) {
      setTransactions(response?.data);
    }

    if (response.status == 0) {
      Toast.danger({ title: "Error", body: response.message });
    }
    if (response.status == undefined) {
      setNetworkRequestFailed(true);
    }
  };
  return (
    <PaperSafeView>
      <View>
        <Appbar className="bg-transparent">
          <Appbar.Content title="Transactions" />
          <Appbar.Action icon={"face-agent"} onPress={() => null} />
        </Appbar>
      </View>
      <View className="space-x-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={services}
          renderItem={({ item }) => (
            <View className="px-3">
              <Chip
                selected={selectedService == item}
                onPress={() => setSelectedService(item)}
              >
                {item}
              </Chip>
            </View>
          )}
        />
      </View>
      <RefreshControl
        refreshing={false}
        onRefresh={fetchTransactions}
        className="flex-1 mt-2"
      >
        <FlatList
          data={transactions}
          renderItem={({ item }) => (
            <TransactionsListComponent
              onPress={() => {
                router.push({
                  pathname: "/TransactionDetails/[id]",
                  params: { id: item.id },
                });
              }}
              key={item.id}
              title={item.service_type}
              amount={item.amount}
              status={item?.status}
              date={
                item?.created_at
                  ? new Date(item.created_at).toDateString()
                  : "N/A"
              }
              description={item.description}
              side={item.side}
              type={item.type}
            />
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center mt-10">
              {fetching ? (
                <View className="items-center justify-center space-y-3 mt-5">
                  <ActivityIndicator size={30} />
                  <Text>Loading Transactions...</Text>
                </View>
              ) : networkRequestFailed ? (
                <View className="px-10 items-center">
                  <Image
                    className="h-[70px] w-[70px] self-center "
                    source={require("@/assets/images/gif/failed_anim.webp")}
                  />
                  <Text className="text-center text-lg mt-2 font-bold font-mono">
                    Network Disconnected
                  </Text>
                  <Text className="opacity-70 text-center">
                    Please check your network connection and press reload
                  </Text>
                  <Button
                    onPress={fetchTransactions}
                    className="mt-5"
                    mode={"contained-tonal"}
                  >
                    Reload
                  </Button>
                </View>
              ) : (
                <View>
                  <Image
                    className="h-[70px] w-[70px] self-center "
                    source={require("@/assets/images/gif/no_transactions_anim.webp")}
                  />
                  <Text className="text-center text-[12px] mt-2">
                    No Transactions Yet!
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      </RefreshControl>
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default transactions;
