import { FlatList, View } from "react-native";
import React from "react";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { formatNumber } from "@/constants/Formats";
import { router } from "expo-router";

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
const RecentTransactions: Array<RecentTransactionsType> = [
  {
    id: 1,
    side: "DEBIT",
    title: "DATA",
    type: "DATA",
    description: "You successfully buy 2.0 GB of data to ",
    date: "2 Apr 2026",
    amount: 2000,
    status: "Success",
  },
];

const RecentTransactionsListComponent = ({
  id,
  side,
  title,
  amount,
  date,
  description,
  onPress,
}: TransactionsListComponentProps) => {
  const getState = () => {
    if (side.toUpperCase() == "DEBIT") {
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
    <View className="">
      <List.Item
        onPress={onPress}
        title={title}
        description={description}
        descriptionNumberOfLines={1}
        descriptionEllipsizeMode={"tail"}
        right={() => (
          <View className="items-center">
            <Text
              style={{ color: getState().color }}
              className="text-green-600"
            >
              {" "}
              {getState().format}
            </Text>
            <Text className="text-[10px] opacity-75">{date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const RecentTransactionsContainer = () => {
  const theme = useTheme();
  return (
    <View>
      <Text className="font-bold">Recent Transactions</Text>
      <View
        style={{ backgroundColor: theme.colors.primaryContainer }}
        className=" rounded-lg mt-2"
      >
        {RecentTransactions.map((item) => (
          <RecentTransactionsListComponent
            key={item?.id}
            type={item.type}
            status={item.status}
            title={item.title}
            description={item.description}
            side="debit"
            amount={item.amount}
            date={item.date}
            onPress={() =>
              router.push({
                pathname: "/TransactionDetails/[id]",
                params: { id: `${item.id}` },
              })
            }
          />
        ))}
      </View>
    </View>
  );
};

export default RecentTransactionsContainer;
