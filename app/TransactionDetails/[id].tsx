import { Modal, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Appbar,
  Button,
  DataTable,
  Divider,
  Icon,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { PaperSafeView } from "@/components/PaperView";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet from "@/components/models/BottomSheet";
import { StatusBar } from "expo-status-bar";
import { Transactions } from "@/constants/DemoList";
import { formatDate, toNumber } from "@/constants/Utils";
import Animated, { FadeIn, FadingTransition } from "react-native-reanimated";
import { formatNumber } from "@/constants/Formats";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { showMessage } from "react-native-flash-message";
import * as WebBrowser from "expo-web-browser";
import requests from "@/Network/HttpRequest";
import { Image } from "expo-image";
import NoConnectionModal from "@/components/models/NoConnectionModal";

//type TransactionsType = Transactions

interface TransactionDetailsTypeDataProps {
  type: string | undefined;
  data: any;
  recipt: any;
}
const TransactionDetailsTypeData = ({
  type,
  recipt,
  data,
}: TransactionDetailsTypeDataProps) => {
  return (
    <View>
      {type?.toLowerCase() == "data" && (
        <View>
          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Mobile Number</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>07026426748</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Plan</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{data?.plan}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Network</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{data?.network}</DataTable.Cell>
          </DataTable.Row>
          
        </View>
      )}
      {type?.toLowerCase() == "airtime" && (
        <View>
          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Mobile Number</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{data?.number}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Network</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{data?.network}</DataTable.Cell>
          </DataTable.Row>
        </View>
      )}
    </View>
  );
};

const TransactionDetails = () => {
  const { id, action, fileType } = useLocalSearchParams();
  const theme = useTheme();
  const [recipt, setRecipt] = useState<any>(Transactions[0]);
  const [transaction, setTransaction] = useState<any>({});
  const [menuSheetVisible, setMenuSheetVisible] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const viewRef = useRef<any>(null);
  const [downloadOptionSheetVisible, setDownloadOptionSheetVisible] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTransaction();
    }, []),
  );

  const fetchTransaction = async () => {
    setFetching(true);
    setNetworkError(false)
    const response = await requests.get({ url: `/user/transactions/${id}/` });

    setFetching(false);

    if (response.status == 1) {
      setNetworkError(false);
      setTransaction(response?.data);
    }

    if (response.status == 0) {
      setNetworkError(true);
    }

    if (response.status == undefined) {
      setNetworkError(true);
    }

    const transaction = Transactions.find(
      (item) => item.id == toNumber(id.toString()),
    );
    setRecipt(transaction);

    performAction();
  };

  const performAction = () => {
    if (action == "download") {
      handleDownload();
    }
    if (action == "share") {
      handleShareTransactionRecipt();
    }
  };

  const handleDownload = () => {
    setDownloadOptionSheetVisible(false);
    handleSaveTransactionRecipt();
  };

  const handleShareTransactionRecipt = async () => {
    const uri = await viewRef?.current?.capture();
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      showMessage({
        message: "Sharing not available",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    await Sharing.shareAsync(uri)
      .then((value) => {
        console.log("share Response", value);
      })
      .catch((resone) => {
        console.log("Share Reject: ", resone);
      });

    if (action == "share") {
      router.back();
    }
  };

  const handleSaveTransactionRecipt = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      showMessage({
        message: "Permission required",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    try {
      const uri = await viewRef.current?.capture();

      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        showMessage({
          message: "Saved successfully!",
          type: "success",
          icon: "success",
          duration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
    if (action == "download") {
      router.back();
    }
  };

  const getTransactionStatusIcon = () => {
    return (
      <View className="h-[50px] w-[50px] bg-green-600 items-center justify-center rounded-full mb-2">
        <Icon source={"check"} size={30} color={"white"} />
      </View>
    );
  };
  return (
    <PaperSafeView>
      <Appbar className="bg-transparent">
        <Appbar.Action
          isLeading
          icon={({ color, size }) => (
            <MaterialIcons name="keyboard-arrow-left" size={24} color={color} />
          )}
          onPress={() => router.back()}
        />
        <Appbar.Content title="Details" />
        <Appbar.Action
          icon={({ color, size }) => (
            <Icon source="dots-vertical" size={24} color={color} />
          )}
          onPress={() => setMenuSheetVisible(true)}
        />
      </Appbar>

      {fetching && (
        <View className="flex-1 items-center justify-center">
          <View className="items-center justify-center space-y-5">
            <ActivityIndicator size={35} />
            <Text>Loading Transaction...</Text>
          </View>
        </View>
      )}

      {!fetching && (
        <ViewShot
          style={{
            backgroundColor: "transparent",
            paddingVertical: 10,
            borderRadius: 12,
          }}
          ref={viewRef}
          options={{ format: "png", quality: 1 }}
        >
          <View className="items-center mt-5">
            <View>
              {getTransactionStatusIcon()}

              <Text className="text font-bold">{transaction?.status}</Text>
            </View>
            <View className="w-full px-5 mt-2">
              <Text className="text-center">{transaction?.description}</Text>
            </View>
          </View>

          <View className="px-5 mt-10">
            <View
              style={{ backgroundColor: theme.colors.primaryContainer }}
              className="rounded-lg"
            >
              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Transaction ID</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>{transaction?.id}</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Service</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {transaction?.service_type}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Status</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>{transaction?.status}</DataTable.Cell>
              </DataTable.Row>

              <TransactionDetailsTypeData
                data={transaction?.service_data}
                type={transaction?.service_type}
                recipt={recipt}
              />

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Amount</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  ₦{formatNumber(toNumber(`${transaction?.amount}`))}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>
                  <Text className="font-bold">Date</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {formatDate(transaction?.created_at)}
                </DataTable.Cell>
              </DataTable.Row>
            </View>
          </View>
        </ViewShot>
      )}

      <BottomSheet
        visible={downloadOptionSheetVisible}
        onDismiss={setDownloadOptionSheetVisible}
        animationType={"fade"}
        mode={"center"}
      >
        <View className="py-2">
          <View className="px-3">
            <Text className="text-lg font-bold">Download As</Text>
          </View>
          <View className="px-5 mb-3">
            <List.Section>
              <List.Item
                onPress={handleDownload}
                left={({ color }) => (
                  <FontAwesome6 name="image" size={24} color={color} />
                )}
                title="Image ( PNG )"
              />
            </List.Section>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        mode={"center"}
        visible={menuSheetVisible}
        onDismiss={setMenuSheetVisible}
      >
        <View>
          <View className="px-5">
            <List.Section>
              <List.Item
                onPress={async (e) => {
                  setMenuSheetVisible(false);
                  e.preventDefault();
                  await WebBrowser.openBrowserAsync(
                    "https://wa.me/+2347026426748",
                  );
                }}
                left={({ color }) => (
                  <MaterialIcons
                    name="contact-support"
                    size={24}
                    color={color}
                  />
                )}
                title="Contact Support"
              />
            </List.Section>
          </View>
        </View>
      </BottomSheet>

      {!fetching && (
        <View className="absolute bottom-0 w-full mb-10 px-5 space-x-5 flex-row">
          <Button
            onPress={handleShareTransactionRecipt}
            mode="outlined"
            className=""
          >
            Share Recipt
          </Button>
          <Button
            onPress={() => setDownloadOptionSheetVisible(true)}
            mode="contained"
          >
            Download Recipt
          </Button>
        </View>
      )}

      <StatusBar style={theme.dark ? "light" : "dark"} />

      <NoConnectionModal onRetry={() => fetchTransaction()} visible={networkError} />
    </PaperSafeView>
  );
};

export default TransactionDetails;
