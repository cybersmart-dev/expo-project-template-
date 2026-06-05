import { View, Pressable, BackHandler } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { PaperSafeView } from "@/components/PaperView";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Appbar, Button, Icon, List, useTheme, Text } from "react-native-paper";
import BottomSheet from "@/components/models/BottomSheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { createAnimatedComponent } from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import CustomAppbar from "@/components/CustomAppbar";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{olj[ayj[j[cbj[ayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const AnimatedIcon = createAnimatedComponent(Icon);

const transfer_response = () => {
  const theme = useTheme();
  const response = useLocalSearchParams();
  const [transferData, setTransferData] = useState<any>();
  const [iconKey, setIconKey] = useState(0);
  const [downloadOptionSheetVisible, setDownloadOptionSheetVisible] =
    useState(false);

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener("hardwareBackPress", () => {
        router.push("/(tabs)");
        return true;
      });
      return () => back.remove();
    }, []),
  );

  useEffect(() => {
    getTransferData();
    return () => {};
  }, []);

  const getTransferData = () => {
    const dataString = response?.data;
    if (dataString) {
      const data = JSON.parse(dataString.toString());
      setTransferData(data);
    }
  };

  const handleDownload = (fileType: string) => {
    setDownloadOptionSheetVisible(false);
    router.push({
      pathname: "/TransactionDetails/[id]",
      params: { id: transferData.id, action: "download", fileType: fileType },
    });
  };

  return (
    <PaperSafeView className="flex-1">
      <CustomAppbar>
        <Appbar.Content title="" />
        <Button onPress={() => router.push("/(tabs)")}>Done</Button>
      </CustomAppbar>
      <View>
        <View className="items-center gap-y-4 mt-5">
          <View className="items-center ">
            {transferData?.statusCode == 1 && (
              <Image
                style={{ height: 70, width: 70 }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
                source={require("@/assets/images/gif/success_anim.webp")}
              />
            )}

            {transferData?.statusCode == 0 && (
              <Image
                style={{ height: 70, width: 70 }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
                source={require("@/assets/images/gif/failed_anim.webp")}
              />
            )}

            {
              transferData?.statusCode == 2 && (
                <Image
                  style={{ height: 70, width: 70 }}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                  source={require("@/assets/images/transaction_pending.png")}
                />
              )
            }

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                textTransform: "uppercase",
                textAlign:"center"
              }}
              className="w-screen"
            >
              {transferData?.status}
            </Text>
          </View>
          <View className="w-full px-5">
            <Text style={{ textAlign: "center" }} className="text-center">
              {transferData?.message}
            </Text>
          </View>
        </View>
      </View>

      
        <View className="absolute top-[50%] w-full px-10">
          <View className="">
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/TransactionDetails/[id]",
                  params: { id: transferData.id },
                });
              }}
              style={{ backgroundColor: theme.colors.primary }}
              className="flex-row items-center justify-between px-3 rounded-lg"
            >
              <Text style={{ color: theme.colors.background }}>
                View Transaction Details
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={theme.colors.background}
              />
            </Pressable>
          </View>
        </View>
      

      {transferData?.statusCode == 1 && (
        <View className="absolute bottom-0 mb-10 gap-y-5 items-center w-full px-10">
          <Button
            onPress={() => {
              router.push({
                pathname: "/TransactionDetails/[id]",
                params: { id: transferData.id, action: "share" },
              });
            }}
            mode="outlined"
            className="w-full"
          >
            Share Recipt
          </Button>
          <Button
            onPress={() => setDownloadOptionSheetVisible(true)}
            mode="contained"
            className="w-full"
          >
            Download Recipt
          </Button>
        </View>
      )}
      {transferData?.statusCode != 1 && (
        <View className="absolute bottom-0 mb-10 justify-around flex-row items-center w-full px">
          <Button onPress={() => null} mode="contained" className="">
            Contact Support
          </Button>

          <Button
            onPress={() => router.back()}
            mode="outlined"
            className=""
            icon={"sync"}
          >
            Try Again
          </Button>
        </View>
      )}
      <BottomSheet
        visible={downloadOptionSheetVisible}
        onDismiss={setDownloadOptionSheetVisible}
        animationType={"fade"}
        mode={"center"}
      >
        <View className="py-0">
          <View className="px-3">
            <Text className="text-lg font-bold">Download As</Text>
          </View>
          <View className="px-5 mb-3">
            <List.Section>
              <List.Item
                onPress={() => handleDownload("png")}
                left={({ color }) => (
                  <FontAwesome6 name="image" size={24} color={color} />
                )}
                title="Image ( PNG )"
              />
            </List.Section>
          </View>
        </View>
      </BottomSheet>
    </PaperSafeView>
  );
};

export default transfer_response;
