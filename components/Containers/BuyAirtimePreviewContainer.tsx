import { View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  DataTable,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { NetworksType } from "@/constants/Types";
import { formatNumber } from "@/constants/Formats";
import { Image } from "react-native";
import Button from "../Buttons/Button";
import { getUserInfo } from "@/constants/UserInfo";
import { toNumber } from "@/constants/Utils";

interface BuyAirtimePreviewContainerProps {
  networkData: NetworksType[0];
  amount: number;
  mobileNumber?: string;
  onConfirm: () => void;
  onCashBack?: (value: boolean) => void
}

const BuyAirtimePreviewContainer = ({
  networkData,
  amount,
  mobileNumber,
  onConfirm,
  onCashBack
}: BuyAirtimePreviewContainerProps) => {
  const timerRef = useRef(0);
  const theme = useTheme();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(undefined);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = useCallback(async () => {
    try {
      const info = await getUserInfo();
      if (info) {
        setUserInfo(info);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (onCashBack) {
      onCashBack(isSwitchOn)
    }
  }, [isSwitchOn]);

  const getAnount = useCallback(() => {
    let cashback = toNumber(userInfo?.wallet?.cashback);

    if (isSwitchOn && cashback >= amount) {
      return 0.0;
    }

    if (isSwitchOn) {
      return amount - cashback;
    }
    return amount;
  }, [isSwitchOn]);

  return (
    <View className="p-2 h-full flex relative">
      <View className="px-5 items-center justify-between flex-row">
        <Text className="text-lg font-bold">Buy Airtime</Text>
        <View className="flex-row items-center">
          <Text>Pay: </Text>
          <Text style={{ fontWeight: "bold" }} className="text-lg">
            ₦{formatNumber(getAnount())}
          </Text>
        </View>
      </View>
      <View className="">
        <View className="pt-4">
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Network</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <View className="flex-row items-center gap-x-2">
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
              <DataTable.Cell numeric>₦{formatNumber(amount)}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </View>

      <View className="w-full px-3 mt-2">
        <View className="flex-row items-center ml-1">
          <Text>CashBack: </Text>
          <Text style={{ fontWeight: "bold" }} className="font-bold">
            ₦{formatNumber(userInfo?.wallet?.cashback) || "0.00"}
          </Text>
        </View>
        <View
          style={{ backgroundColor: theme.colors.primaryContainer }}
          className=" rounded-lg h-auto py-2 mt-1"
        >
          <View className=" items-center flex-row justify-between px-3">
            <Text className="">Use CashBack</Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          </View>
        </View>
      </View>

      <View className="my-4 mt-5 bottom-0 w-full px-3 mb-5 ">
        <Button mode="contained" onPress={onConfirm}>
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default BuyAirtimePreviewContainer;
