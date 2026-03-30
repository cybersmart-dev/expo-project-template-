import { View, Text, FlatList } from "react-native";
import React from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, List, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Transactions } from "@/constants/DemoList";
import { formatNumber } from "@/constants/Formats";

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
const transactions = () => {
  const theme = useTheme();
  return (
    <PaperSafeView>
      <View>
        <Appbar>
          <Appbar.Content title="Transactions" />
          <Appbar.Action icon={"filter"} onPress={() => null} />
        </Appbar>
      </View>
      <View className="flex-1">
        <FlatList
          data={Transactions}
          renderItem={({ item }) => (
            <TransactionsListComponent
              onPress={() => {
                router.push({
                  pathname: "/TransactionDetails/[id]",
                  params: { id: item.id },
                });
              }}
              key={item.id}
              title={item.title}
              amount={item.amount}
              date={item.date}
              description={item.description}
              side={item.side}
              type={item.type}
            />
          )}
        />
      </View>
      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default transactions;
