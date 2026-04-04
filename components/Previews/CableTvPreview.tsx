import { View } from "react-native";
import React from "react";
import { Button, DataTable, Text } from "react-native-paper";
import { CableTVSubscription } from "@/constants/DemoList";

interface CableTvPreviewProps {
  selectedProvider?: (typeof CableTVSubscription)[0];
  selectedPlan?: (typeof CableTVSubscription)[0]["plans"][0];
  iuc: string;
  onConfirm: () => void;
}

const CableTvPreview = ({
  selectedProvider,
  selectedPlan,
    iuc,
  onConfirm
}: CableTvPreviewProps) => {
  return (
    <View>
      <View className="px-4 mt-1">
        <Text className="font-bold text-lg">Preview</Text>
      </View>

      <View className="px-4 h-full pt-4">
        <DataTable.Row>
          <DataTable.Cell>
            <Text className="font-bold">Provider</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>{selectedProvider?.name}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text className="font-bold">ID</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>{iuc}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>
            <Text className="font-bold">Plan</Text>
          </DataTable.Cell>
          <DataTable.Cell numeric>{selectedPlan?.name}</DataTable.Cell>
        </DataTable.Row>
        <View className="w-full p-3 mt-2">
          <Button
            onPress={onConfirm}
            mode="contained"
            className="text-lg p-1"
            style={{ borderRadius: 15 }}
            labelStyle={{ fontSize: 16 }}
          >
            Confirm
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CableTvPreview;
