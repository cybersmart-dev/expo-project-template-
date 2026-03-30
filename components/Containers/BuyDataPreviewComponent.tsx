import { DataPackType, NetworksType } from "@/constants/Types";
import React, { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
import { ActivityIndicator, Button, DataTable, Text } from "react-native-paper";

interface BuyDataPreviewComponentProps {
  networkData: NetworksType[0];
  pack?: DataPackType;
  mobileNumber?: string;
  onConfirm: () => void;
}

const BuyDataPreviewComponent = ({
  networkData,
  pack,
  mobileNumber,
  onConfirm,
}: BuyDataPreviewComponentProps) => {
  const [validatingTransaction, setValidatingTransaction] = useState(true);
  const timerRef = useRef(0);

  useEffect(() => {
    validateTransaction();

    return () => {
      clearTimer();
    };
  }, []);

  const validateTransaction = () => {
    setValidatingTransaction(true);

    timerRef.current = setTimeout(() => {
      setValidatingTransaction(false);
      console.log("runnung");

      if (timerRef?.current) {
        clearTimer();
      }
    }, 2000);
  };

  const clearTimer = () => {
    clearTimeout(timerRef?.current);
    //timerRef?.current = null
  };

  return (
    <View className="pb-6">
      <View className="px-4 mt-1">
        <Text className="font-bold text-lg">Preview</Text>
      </View>

      {validatingTransaction && (
        <View className="h-full w-full items-center justify-center">
          <View className="space-y-5 mb-20">
            <ActivityIndicator />
            <Text className="text font-bold">Processing</Text>
          </View>
        </View>
      )}

      {!validatingTransaction && (
        <View className="px-4 h-full pt-4">
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
                <Text className="font-bold">benefits</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{pack?.benefits}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{pack?.price}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Validity</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{pack?.validity}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      )}

      <View className="absolute bottom-10 w-full mb-5 px-5 mt-5">
        <Button
          disabled={validatingTransaction}
          onPress={onConfirm}
          className="text-lg p-1"
          style={{ borderRadius: 15 }}
          labelStyle={{ fontSize: 16 }}
          mode="contained"
        >
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default BuyDataPreviewComponent;
