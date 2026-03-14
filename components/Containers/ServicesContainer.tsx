import { View, Text } from "react-native";
import React, { useState } from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet from "../models/BottomSheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "react-native-paper";

const ServicesContainer = () => {
  const [showMoreBottomSheet, setshowMoreBottomSheet] = useState(false);
  return (
    <View className="space-y-5 items-center px-5">
      <View className="flex-row items-center justify-between w-[95%] ml-4">
        <ActionButton
          label="Betting"
          icon={() => (
            <FontAwesome name="soccer-ball-o" size={24} color="white" />
          )}
        />
        <ActionButton
          label="Result Checker"
          icon={() => <FontAwesome name="check" size={24} color="white" />}
        />
        <ActionButton
          label="Earnning"
          icon={() => <FontAwesome name="money" size={24} color="white" />}
        />
      </View>
      <View className="flex-row items-center justify-between w-[95%]">
        <ActionButton
          label="Electricity"
          icon={() => <FontAwesome name="bolt" size={24} color="white" />}
        />
        <ActionButton
          label="Cable TV"
          icon={() => <FontAwesome name="tv" size={24} color="white" />}
        />
        <ActionButton
          label="More"
          onPress={() => setshowMoreBottomSheet(true)}
          icon={() => <FontAwesome name="ellipsis-h" size={24} color="white" />}
        />
      </View>
      <BottomSheet
        height={"50%"}
        visible={showMoreBottomSheet}
        dismissable={true}
        onDismiss={() => setshowMoreBottomSheet(false)}
      >
        <View className="px-3 mt-1 p-4 space-y-5 h-full">
          <Text className="text-lg font-bold">More Service</Text>

          <View className="flex-row w-[100%] items-center justify-between mt-5 ml-1">
            <ActionButton
              label="Widthdraw"
              icon={() => <FontAwesome name="bank" size={24} color="white" />}
            />
            <ActionButton
              label="Transfer"
              icon={() => (
                <FontAwesome6
                  name="money-bill-transfer"
                  size={24}
                  color="white"
                />
              )}
            />
            <ActionButton
              label="Airtime to Cash"
              icon={() => (
                <FontAwesome6
                  name="mobile-screen-button"
                  size={24}
                  color="white"
                />
              )}
            />
          </View>
          <View className="flex-row w-[100%] items-center justify-between mt-5">
            <ActionButton
              label="Help Center"
              icon={() => (
                <MaterialIcons name="help-center" size={24} color="white" />
              )}
            />
            <ActionButton
              label="Settings"
              icon={() => (<FontAwesome name="cog" size={24} color="white" />)}
            />
            <ActionButton
              label="Contact Us"
              icon={() => (
                <MaterialIcons name="contact-support" size={24} color="white" />
              )}
            />
          </View>
          <View className="absolute bottom-0 w-full mb-5 right-[6.5%]">
            <Button onPress={() => setshowMoreBottomSheet(false)} mode="outlined">Close</Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default ServicesContainer;
