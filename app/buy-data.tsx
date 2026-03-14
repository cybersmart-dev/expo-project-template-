import { View } from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, Button, Chip, Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectNetworkComponent from "@/components/Selection/SelectNetworkComponent";
import DataListContainer from "@/components/Containers/DataListContainer";
import { StatusBar } from "expo-status-bar";
import { DataPackType, NetworksType } from "@/constants/Types";
import BottomSheet from "@/components/models/BottomSheet";
import BuyDataPreviewComponent from "@/components/Containers/BuyDataPreviewComponent";
import { Networks } from "@/constants/DemoList";
import { isValidMobileNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";

const buydata = () => {
  const theme = useTheme();
  const [selectedNetworkName, setSelectedNetworkName] = useState<
    "mtn" | "airtel" | "glo" | "9mobile"
  >("mtn");
  const [selectedBundlePacks, setSelectedBundlePacks] = useState<DataPackType>({
    id: 1,
    price: 2,
    validity: "",
    benefits: "",
  });
  const [selectedNetworkData, setselectedNetworkData] = useState<
    NetworksType[0]
  >(Networks[0]);
  const [mobileNumber, setMobileNumber] = useState("");

  const [buyDataPreviewVisible, setBuyDataPreviewVisible] = useState(false);

  const handlePackSelect = (data: DataPackType) => {
    if (!isValidMobileNumber(mobileNumber)) {
      showMessage({
        message: "Please Enter valid mobile number",
        type: 'danger',
        icon:'danger'
      });
      return
    }
    setSelectedBundlePacks(data);
    setBuyDataPreviewVisible(true);
  };
  return (
    <PaperSafeView className="flex-1">
      <View>
        <Appbar
          style={{ backgroundColor: theme.colors.primary }}
          collapsable={true}
        >
          <Appbar.Action
            isLeading
            color={"white"}
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />

          <Appbar.Content color="white" title="Buy Data" />
          <Appbar.Action
            color="white"
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
      </View>

      <View className="flex-1">
        <View className="mt-10">
          <SelectNetworkComponent
            onChangeText={setMobileNumber}
            onSelectNetwork={(data) => {
              setSelectedNetworkName(data.name);
              setselectedNetworkData(data);
            }}
          />
        </View>

        <View>
          <DataListContainer
            network={selectedNetworkName}
            onPackSelect={handlePackSelect}
          />
        </View>
      </View>

      <StatusBar backgroundColor={theme.colors.primary} style="light" />
      <BottomSheet
        mode="full-width"
        height={"auto"}
        visible={buyDataPreviewVisible}
        onDismiss={() => setBuyDataPreviewVisible(false)}
      >
        <BuyDataPreviewComponent
          mobileNumber={mobileNumber}
          pack={selectedBundlePacks}
          networkData={selectedNetworkData}
          onConfirm={() => setBuyDataPreviewVisible(false)}
        />
        
      </BottomSheet>
    </PaperSafeView>
  );
};

export default buydata;
