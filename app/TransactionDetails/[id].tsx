import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { router, useLocalSearchParams } from "expo-router";
import { PaperSafeView } from "@/components/PaperView";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet from "@/components/models/BottomSheet";
import { StatusBar } from "expo-status-bar";
import { Transactions } from "@/constants/DemoList";
import { toNumber } from "@/constants/Utils";
import Animated, { FadeIn, FadingTransition } from "react-native-reanimated";
import { formatNumber } from "@/constants/Formats";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { showMessage } from "react-native-flash-message";

//type TransactionsType = Transactions

interface TransactionDetailsTypeDataProps {
  type: string | undefined;
  recipt: any;
}
const TransactionDetailsTypeData = ({
  type,
  recipt,
}: TransactionDetailsTypeDataProps) => {
  return (
    <View>
      {type == "data" && (
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
            <DataTable.Cell numeric>{recipt?.data?.plan}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>
              <Text className="font-bold">Network</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>{recipt?.data?.network}</DataTable.Cell>
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
  const [menuSheetVisible, setMenuSheetVisible] = useState(false);
  const viewRef = useRef<any>(null);
  const [downloadOptionSheetVisible, setDownloadOptionSheetVisible] =
    useState(false);

  useEffect(() => {
    fetchTransaction();
    return () => {};
  }, [id]);

  const fetchTransaction = () => {
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
    if (action == 'share') {
      handleShareTransactionRecipt()
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

    await Sharing.shareAsync(uri).then((value) => {
      console.log("share Response", value);
      
    }).catch((resone) => {
      console.log("Share Reject: ", resone);
      
    })

    if (action == 'share') {
      router.back()
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

  return (
    <PaperSafeView>
      <Appbar>
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

      <ViewShot
        style={{
          backgroundColor: theme.colors.background,
          paddingVertical: 10,
          borderRadius: 12,
        }}
        ref={viewRef}
        options={{ format: "png", quality: 1 }}
      >
        <View className="items-center mt-5">
          <View>
            <View className="h-[50px] w-[50px] bg-green-600 items-center justify-center rounded-full mb-2">
              <Icon source={"check"} size={30} color={"white"} />
            </View>
            <Text className="text font-bold">{recipt?.status}</Text>
          </View>
          <View className="w-full px-5 mt-2">
            <Text className="text-center">{recipt?.description}</Text>
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
              <DataTable.Cell numeric>{recipt?.id}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Status</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{recipt?.status}</DataTable.Cell>
            </DataTable.Row>

            <TransactionDetailsTypeData
              type={recipt?.data?.type}
              recipt={recipt}
            />

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                ₦{formatNumber(toNumber(`${recipt?.amount}`))}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Date</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{recipt?.date}</DataTable.Cell>
            </DataTable.Row>
          </View>
        </View>
      </ViewShot>

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
                onPress={() => {
                  setMenuSheetVisible(false);
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

      <StatusBar style="dark" />
    </PaperSafeView>
  );
};

export default TransactionDetails;
