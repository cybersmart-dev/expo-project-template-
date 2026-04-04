import {
  GestureResponderEvent,
  Image,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import {
  Appbar,
  useTheme,
  Text,
  TextInput,
  Button,
  DataTable,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Timer, toNumber } from "@/constants/Utils";
import { showMessage } from "react-native-flash-message";
import BottomSheet from "@/components/models/BottomSheet";
import TransactionPinSheet from "@/components/models/TransactionPinSheet";

const resultchacker = () => {
  const theme = useTheme();
  const [selectedExam, setSelectedExam] = useState("");
  const [quantity, setQuantity] = useState("");
  const [examPreviewSheetVisible, setExamPreviewSheetVisible] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);

  const [transactionPinSheetVisible, setTransactionPinSheetVisible] =
    useState(false);

  function handleNext(e: GestureResponderEvent): void {
    Keyboard.dismiss();

    if (!selectedExam) {
      showMessage({
        message: "Please Select Exam",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (toNumber(quantity) <= 0) {
      showMessage({
        message: "Please Enter valid quantity",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    if (toNumber(quantity) > 5) {
      showMessage({
        message: "Maximun quantity is 5",
        type: "danger",
        icon: "danger",
      });
      return;
    }
    setExamPreviewSheetVisible(true);
  }

  const handlePinComplate = async (pin: string) => {
    setTransactionProcessing(true);
    const finished = await new Timer().postDelayedAsync({ sec: 3000 });
    setTransactionPinSheetVisible(false);
    setTransactionProcessing(false);

    router.push({
      pathname: "/modals/transfer_response",
      params: {
        status: "Success",
        type: "Betting",
        amount: 2000,
        data: JSON.stringify({
          statusCode: 1,
          type: "betting",
          id: 1,
          charge: 0.0,
          cashback: 0.4,
          message: `You have successfuly send ${200} to id ${selectedExam}`,
        }),
      },
    });
  };

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <View>
        <Appbar className="bg-transparent" collapsable={true}>
          <Appbar.Action
            isLeading
            icon={({ color, size }) => (
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={color}
              />
            )}
            onPress={() => router.back()}
          />

          <Appbar.Content title="Result Chaker" />
          <Appbar.Action
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />
        </Appbar>
        <View className="mt-5">
          <View className="flex-row items-center justify-evenly">
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedExam == "waec"
                    ? theme.colors.secondary
                    : theme.colors.elevation.level0,
              }}
              onPress={() => setSelectedExam("waec")}
              className="bg-blue-300 p-3 rounded-lg"
            >
              <Image
                className="h-20 w-20 rounded-full"
                resizeMode={"contain"}
                source={require("@/assets/images/waec.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedExam == "neco"
                    ? theme.colors.secondary
                    : theme.colors.elevation.level0,
              }}
              onPress={() => setSelectedExam("neco")}
              className="bg-blue-300 p-3 rounded-lg"
            >
              <Image
                className="h-20 w-20 rounded-full"
                resizeMode={"contain"}
                source={require("@/assets/images/neco.png")}
              />
            </TouchableOpacity>
          </View>

          <View className="px-5 space-y-10 mt-10">
            <TextInput
              className="bg-transparent"
              placeholder="Quantity"
              keyboardType={"numeric"}
              onChangeText={setQuantity}
              outlineStyle={{ borderRadius: 15 }}
              mode="outlined"
            />
            <View className="">
              <Button
                onPress={handleNext}
                className="text-lg p-1"
                style={{ borderRadius: 15 }}
                labelStyle={{ fontSize: 16 }}
                mode="contained"
              >
                Purchase
              </Button>
            </View>
          </View>
        </View>
      </View>

      <BottomSheet
        visible={examPreviewSheetVisible}
        onDismiss={setExamPreviewSheetVisible}
        height={"50%"}
      >
        <View>
          <View className="px-4 mt-1">
            <Text className="font-bold text-lg">Preview</Text>
          </View>

          <View className="px-4 h-full pt-4">
            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Exam</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {selectedExam.toUpperCase()}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Quantity</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{quantity}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{2000}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Total Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {2000 * toNumber(quantity)}
              </DataTable.Cell>
            </DataTable.Row>
          </View>
          <View className="absolute bottom-10 w-full mb-5 px-5 mt-5">
            <Button
              className="text-lg p-1 w-full"
              style={{ borderRadius: 15 }}
              labelStyle={{ fontSize: 16 }}
              mode="contained"
              onPress={ async () => {
                setExamPreviewSheetVisible(false)
                await new Timer().postDelayedAsync({ sec: 500 })
                setTransactionPinSheetVisible(true)
              }}
            >
              Confirm
            </Button>
          </View>
        </View>
      </BottomSheet>
      <TransactionPinSheet
        visible={transactionPinSheetVisible}
        onCancel={() => setTransactionPinSheetVisible(false)}
        onComplate={handlePinComplate}
        processingTransaction={transactionProcessing}
      />
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </PaperSafeView>
  );
};

export default resultchacker;
