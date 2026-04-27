import { FlatList, View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { formatNumber, getTransactionSideFormat } from "@/constants/Formats";
import { router, useFocusEffect } from "expo-router";
import requests from "@/Network/HttpRequest";
import { Toast } from "@/constants/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TransactionsListComponentProps {
  id?: number;
  side: string;
  title: string;
  type?: string;
  description: string;
  date: string;
  amount: number;
  status?: string;
  onPress?: () => void;
}

type RecentTransactionsType = {
  id?: number;
  side: string;
  title: string;
  type?: string;
  description: string;
  date: string;
  amount: number;
  status?: string;
};

const RecentTransactionsListComponent = ({
  id,
  side,
  title,
  amount,
  date,
  description,
  onPress,
  status,
}: TransactionsListComponentProps) => {
  return (
    <View key={id}>
      <List.Item
        onPress={onPress}
        title={
          <View className="flex-row items-center space-x-1">
            <Text className="font-bold">{title}</Text>
            <Text className="text-[10px]">{status}</Text>
          </View>
        }
        description={description}
        descriptionNumberOfLines={1}
        descriptionEllipsizeMode={"tail"}
        right={() => (
          <View className="items-end justify-evenly">
            <Text
              style={{ color: getTransactionSideFormat(side, amount).color }}
              className="text-green-600"
            >
              {" "}
              {getTransactionSideFormat(side, amount).format}
            </Text>
            <Text className="text-[10px] opacity-75 mt-1">
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
      <Divider />
    </View>
  );
};

interface RecentTransactionsContainerProps {
  refreshKey: number;
}
const RecentTransactionsContainer = ({
  refreshKey,
}: RecentTransactionsContainerProps) => {
  const [fetching, setFetching] = useState(true);
  const [transactions, setTransactions] = useState<Array<object>>([]);
  const [networkRequestFailed, setNetworkRequestFailed] = useState(false);
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [refreshKey]),
  );

  const fetchTransactions = async () => {
    setFetching(true);
    setNetworkRequestFailed(false);
    const response = await requests.get({
      url: `/user/transactions/?service_type=RECENTS`,
    });

    setFetching(false);

    if (response.status == 1) {
      setTransactions(response?.data);
      storeRecentTransactions(response?.data);
    }

    if (response.status == 0) {
      Toast.danger({ title: "Error", body: response.message });
    }
    if (response.status == undefined) {
      loadRecentTransactions()
      setNetworkRequestFailed(true);
    }
  };

  const storeRecentTransactions = async (transactions: Array<object>) => {
    try {
      await AsyncStorage.setItem(
        "recent-transactions",
        JSON.stringify(transactions),
      );
    } catch (error) {}
  };

  const loadRecentTransactions = async () => {
    try {
      const transactionsString = await AsyncStorage.getItem(
        "recent-transactions",
      );
      if (transactionsString) {
        setTransactions(JSON.parse(transactionsString));
      }
    } catch (error) {}
  };

  return (
    <View>
      <View className=" rounded-lg mt-0">
        {transactions.map((item: any) => (
          <RecentTransactionsListComponent
            key={item?.id}
            type={item.type}
            status={item.status}
            title={item.service_type}
            description={item.description}
            side={item?.side}
            amount={item.amount}
            date={item.created_at}
            onPress={() =>
              router.push({
                pathname: "/TransactionDetails/[id]",
                params: { id: `${item.id}` },
              })
            }
          />
        ))}
        {transactions.length == 0 && !fetching && !networkRequestFailed && (
          <View className="w-full">
            <Text className="text-center">NO DATA</Text>
          </View>
        )}
        {fetching && transactions.length == 0 && (
          <View className="">
            <ActivityIndicator />
          </View>
        )}
        {networkRequestFailed && transactions.length == 0 && (
          <View className="w-full">
            <Text className="text-center">
              {"Failed to load transactions".toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default RecentTransactionsContainer;
