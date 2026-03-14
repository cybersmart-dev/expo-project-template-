import { DataPackType, NetworksType } from "@/constants/Types";
import React from "react";
import { Image, View } from "react-native";
import { Button, DataTable, Text } from "react-native-paper";

interface BuyDataPreviewComponentProps {
  networkData: NetworksType[0];
  pack: DataPackType;
  mobileNumber?: string,
  onConfirm: () => void
}

const BuyDataPreviewComponent = ({
  networkData,
  pack,
  mobileNumber,
  onConfirm
}: BuyDataPreviewComponentProps) => {
  return (
    <View className="pb-6">
      <View className="px-4 mt-1">
        <Text className="font-bold text-lg">Preview</Text>
      </View>
      <View className="px-4">
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
            <DataTable.Cell numeric>{pack.benefits}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Amount</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{pack.price}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Validity</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{pack.validity}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>

      <View className="px-5 mt-5">
          <Button onPress={onConfirm} mode="contained">Confirm</Button>
        </View>
    </View>
  );
};

export default BuyDataPreviewComponent;
