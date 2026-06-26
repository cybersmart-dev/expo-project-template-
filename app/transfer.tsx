import {
  BackHandler,
  GestureResponderEvent,
  Pressable,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { Appbar, DataTable, Icon, Text, useTheme } from "react-native-paper";
import CustomAppbar from "@/components/CustomAppbar";
import { router, useFocusEffect } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LargeActionButton from "@/components/Buttons/LargeActionButton";
import { Toast } from "@/constants/Toast";
import ActionButton from "@/components/Buttons/ActionButton";
import { formatNumber } from "@/constants/Formats";
import BottomSheet from "@/components/models/BottomSheet";
import TextInput from "@/components/Inputs/TextInput";
import Button from "@/components/Buttons/Button";
import { getUserInfo } from "@/constants/UserInfo";
import { UserInfoType } from "@/constants/Types";
import { toNumber } from "@/constants/Utils";
import requests from "@/Network/HttpRequest";
import Processing from "@/components/models/Processing";
import { ResponseStatusCode } from "@/constants/StatusCodes";
import { Keyboard } from "react-native";

interface Airtime2CashWalletCompProps {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  userInfo?: UserInfoType;
}

const Airtime2CashWalletComp = ({
  onPress,
  userInfo,
}: Airtime2CashWalletCompProps) => {
  const theme = useTheme();
  const [airtime2CashBalance, setAirtime2CashBalance] = useState(0);

  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: theme.colors.secondaryContainer }}
      className="p-3 flex-row items-center justify-between rounded-2xl"
    >
      <View className="justify-center flex-row items-center gap-x-5">
        <Icon size={24} source={"cash"} />
        <View>
          <Text>Airtime To Cash</Text>
          <Text style={{ fontWeight: "bold" }} className="">
            ₦{formatNumber(userInfo?.wallet?.airtime2cash ?? 0)}
          </Text>
        </View>
      </View>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={24}
        color={theme.colors.onBackground}
      />
    </Pressable>
  );
};

interface BunusWalletCompProps {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  userInfo?: UserInfoType;
}

const BunusWalletComp = ({ onPress, userInfo }: BunusWalletCompProps) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: theme.colors.secondaryContainer }}
      className="p-3 flex-row items-center justify-between rounded-2xl"
    >
      <View className="justify-center flex-row items-center gap-x-5">
        <Icon size={24} source={"cash"} />
        <View>
          <Text>Bunus</Text>
          <Text style={{ fontWeight: "bold" }} className="">
            ₦{formatNumber(userInfo?.wallet?.bonus ?? 0)}
          </Text>
        </View>
      </View>
      <MaterialIcons
        name="keyboard-arrow-right"
        size={24}
        color={theme.colors.onBackground}
      />
    </Pressable>
  );
};

const MainWalletTransferComponent = () => {
  const theme = useTheme();
  const [selectedWallet, setSelectedWallet] = useState<"a2c" | "bonus">("a2c");
  const [walletSelectBottomSheetVisible, setWalletSelectBottomSheetVisible] =
    useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [processingTransfer, setProcessingTransfer] = useState(false);
  const [transferPreviewVisible, setTransferPreviewVisible] = useState(false)

  const loadUserInfo = async () => {
    const userInfo = await getUserInfo();
    if (userInfo) {
      setUserInfo(userInfo);
    }
  };

  useEffect(() => {
    loadUserInfo();
    return () => {};
  }, []);

  const handleSelectWallet = useCallback(
    (walletName: typeof selectedWallet) => {
      setSelectedWallet(walletName);
      setWalletSelectBottomSheetVisible(false);
    },
    [],
  );

  const validateInputs = async () => {
    if (toNumber(amount) < 100) {
      setAmountError(true);
      setAmountErrorMessage("Please Enter valid amount 100 > 100,000");
      return;
    }
    if (
      selectedWallet == "a2c" &&
      toNumber(amount) > toNumber(userInfo?.wallet?.airtime2cash ?? 0)
    ) {
      setAmountError(true);
      setAmountErrorMessage("Insufficient Balance");
      return;
    }

    if (
      selectedWallet == "bonus" &&
      toNumber(amount) > toNumber(userInfo?.wallet?.bonus ?? 0)
    ) {
      setAmountError(true);
      setAmountErrorMessage("Insufficient Balance");
      return;
    }

    setAmountError(false);
    setAmountErrorMessage("");
    setTransferPreviewVisible(true)
  };

  const mainWalletTransfer = async () => {
    setTransferPreviewVisible(false)

    setProcessingTransfer(true);
    const response = await requests.post({
      url: "/main/transfer/",
      data: {
        from: selectedWallet,
        amount: amount,
      },
    });

    setProcessingTransfer(false);

    if (response.status == ResponseStatusCode.SUCCESS) {
      Toast.success({ title: response.message });
      router.push({
        pathname: "/modals/transfer_response",
        params: {
          type: "Transfer",
          amount: amount,
          data: JSON.stringify(response.data),
        },
      });
    }
    if (response.status == ResponseStatusCode.FAILED) {
      await Toast.dangerHapticsAsync({ title: response.message });
    }

    if (response.status == undefined) {
      await Toast.dangerHapticsAsync({ title: response.message });
    }
  };

  return (
    <View className="px-5">
      <View className="my-2">
        <Text>Transfer From</Text>
      </View>
      {selectedWallet == "a2c" && (
        <Airtime2CashWalletComp
          onPress={() => setWalletSelectBottomSheetVisible(true)}
          userInfo={userInfo}
        />
      )}
      {selectedWallet == "bonus" && (
        <BunusWalletComp
          onPress={() => setWalletSelectBottomSheetVisible(true)}
          userInfo={userInfo}
        />
      )}
      <View className="mt-7">
        <TextInput
          error={amountError}
          errorMessage={amountErrorMessage}
          onChangeText={setAmount}
          placeholder="Amount"
          keyboardType={"numeric"}
        />
      </View>

      <View className="mt-5">
        <Button onPress={validateInputs}>Confirm</Button>
      </View>

      <BottomSheet
        mode={"full-width"}
        visible={walletSelectBottomSheetVisible}
        onDismiss={setWalletSelectBottomSheetVisible}
      >
        <View className="px-5 py-5 gap-y-5">
          <Text>Select Wallet</Text>
          <Airtime2CashWalletComp
            onPress={() => handleSelectWallet("a2c")}
            userInfo={userInfo}
          />
          <BunusWalletComp
            onPress={() => handleSelectWallet("bonus")}
            userInfo={userInfo}
          />
        </View>
      </BottomSheet>

      <Processing
        visible={processingTransfer}
        description="Processing Transfer Please Wait"
      />

      <BottomSheet onDismiss={setTransferPreviewVisible} visible={transferPreviewVisible}>
        <View className="pl-5">
          <Text className="text-lg" style={{fontWeight: "bold"}}>Transfer</Text>
        </View>
        <View className="px-3">
          <DataTable>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">From </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>{selectedWallet}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">To </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>Wallet</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold">Amount</Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>₦{formatNumber(toNumber(amount))}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
        <View className="px-5 mt-3 mb-3">
          <Button onPress={mainWalletTransfer}>Transfer</Button>
        </View>
      </BottomSheet>
    </View>
  );
};

const OtherUserTransferComponent = () => {
  return (
    <View>
      <Text>Other User</Text>
    </View>
  );
};

const transfer = () => {
  const theme = useTheme();
  const [transferOption, settransferOption] = useState<"main" | "other" | "">(
    "",
  );
  const [processingTransaction, setProcessingTransaction] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        if (processingTransaction) {
          Toast.warning({ title: "Please wait while Processing..." });
          return true;
        }
        if (transferOption) {
          settransferOption("");
          return true;
        }
        return false;
      });
      return () => back.remove();
    }, [processingTransaction, transferOption]),
  );

  return (
    <PaperSafeView onPress={() => Keyboard.dismiss()}>
      <CustomAppbar>
        <Appbar.Action
          onPress={() => router.back()}
          icon={() => (
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        />
        <Appbar.Content
          color="white"
          title={<Text className="text-lg font-bold">Transfer</Text>}
        />
      </CustomAppbar>

      <View className="w-full h-full">
        {!transferOption && (
          <View>
            <View className="w-full py-3 px-5">
              <Text
                style={{ textAlign: "center", fontWeight: "bold" }}
                className=" text-2xl "
              >
                Please Select Transfer Option
              </Text>
            </View>
            <View className="flex-row items-center justify-around px-3 w-full mt-5">
              <LargeActionButton
                onPress={() => settransferOption("other")}
                icon={"account"}
                label="To other user"
                description="Transfer to zaffy user using email or phone number"
              />
              <LargeActionButton
                onPress={() => settransferOption("main")}
                icon={"wallet"}
                label="To main wallet"
                description="Transfer direct to your main zaffy wallet"
              />
            </View>
          </View>
        )}

        {transferOption == "main" && <MainWalletTransferComponent />}

        {transferOption == "other" && <OtherUserTransferComponent />}
      </View>
    </PaperSafeView>
  );
};

export default transfer;
