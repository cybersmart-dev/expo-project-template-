import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, DataTable, Text } from "react-native-paper";
import { NetworksType } from "@/constants/Types";
import { formatNumber } from "@/constants/Formats";
import { Image } from "react-native";

interface BuyAirtimePreviewContainerProps {
  networkData: NetworksType[0];
  amount: number;
  mobileNumber?: string;
  onConfirm: () => void;
}

const BuyAirtimePreviewContainer = ({
  networkData,
  amount,
  mobileNumber,
  onConfirm,
}: BuyAirtimePreviewContainerProps) => {
  const [validatingTransaction, setValidatingTransaction] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    validateTransaction();

    return () => {
      clearTimer();
    };
  }, []);

  const validateTransaction = () => {
   
  };

  const clearTimer = () => {
    clearTimeout(timerRef?.current);
    //timerRef?.current = null
  };

  return (
    <View className="p-2 h-full relative">
      <View className="px-3">
        <Text className="text-lg font-bold">Preview</Text>
      </View>
      <View className="">
        {validatingTransaction && (
          <View className="h-full w-full items-center justify-center">
            <View className="space-y-5">
              <ActivityIndicator />
              <Text className="text font-bold">Processing</Text>
            </View>
          </View>
        )}
        {!validatingTransaction && (
          <View className="pt-4">
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Network</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <View className="flex-row items-center space-x-2">
                    <Text>{networkData?.name.toUpperCase()}</Text>
                    <Image
                      className="h-7 w-7 rounded-full"
                      source={{ uri: networkData.icon }}
                    />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Mobile Number</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>{mobileNumber}</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Amount</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>{formatNumber(amount)}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
        )}
      </View>
      <View className="my-4 mt-5 absolute bottom-0 w-full ml-2 px-5 mb-5 items-center justify-center">
        <Button
          disabled={validatingTransaction}
          className="text-lg p-1 w-full"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="contained"
          onPress={onConfirm}
        >
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default BuyAirtimePreviewContainer;
