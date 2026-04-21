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
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Transactions } from "@/constants/DemoList";
import { formatNumber } from "@/constants/Formats";
import { Image } from "expo-image";
import requests from "@/Network/HttpRequest";

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
  onPress,
}: TransactionsListComponentProps) => {
  const getState = () => {
    if (side == "DEBIT") {
      return {
        color: "red",
        format: `- ₦${formatNumber(amount)}`,
      };
    }
    return {
      color: "green",
      format: `+ ₦${formatNumber(amount)}`,
    };
  };
  return (
    <List.Item
      title={title}
      onPress={onPress}
      descriptionNumberOfLines={1}
      description={description}
      right={() => (
        <View className="items-center">
          <Text style={{ color: getState().color }} className="text-green-600">
            {" "}
            {getState().format}
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
              ) : (
                <View>
                  <Image
                    className="h-[100px] w-[100px] self-center "
                    source={require("@/assets/images/gif/no_transactions_anim.webp")}
                  />
                  <Text className="text-center text-lg mt-2">
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
