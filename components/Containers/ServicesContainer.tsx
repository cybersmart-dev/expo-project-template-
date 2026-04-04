import { View } from "react-native";
import React, { useState } from "react";
import ActionButton from "../Buttons/ActionButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet from "../models/BottomSheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button, Card, Text } from "react-native-paper";
import { router } from "expo-router";

const ServicesContainer = () => {
  const [showMoreBottomSheet, setshowMoreBottomSheet] = useState(false);
  return (
    <Card>
      <View className="space-y-5 items-center p-5">
        <View className="flex-row items-center justify-between w-[95%] ml-4">
          <ActionButton
            label="Betting"
            onPress={() => router.push("/betting")}
            icon={({ color }) => (
              <FontAwesome name="soccer-ball-o" size={24} color={color} />
            )}
          />

          <ActionButton
            label="Electricity"
            onPress={() => router.push("/electricity")}
            icon={({ color }) => (
              <FontAwesome name="bolt" size={24} color={color} />
            )}
          />

          <ActionButton
            onPress={() => router.push("/cabletv")}
            label="Cable TV"
            icon={({ color }) => (
              <FontAwesome name="tv" size={24} color={color} />
            )}
          />
        </View>

        <View className="flex-row w-full items-center justify-between">
          <ActionButton
            onPress={() => router.push("/result-chacker")}
            label="Result Check"
            icon={({ color }) => (
              <FontAwesome name="book" size={24} color={color} />
            )}
          />
          <ActionButton
            onPress={() => router.push("/contactus")}
            label="Contact Us"
            icon={({ color }) => (
              <MaterialIcons name="contact-support" size={24} color={color} />
            )}
          />

          <ActionButton
            label="    More    "
            onPress={() => setshowMoreBottomSheet(true)}
            icon={({ color }) => (
              <FontAwesome name="ellipsis-h" size={24} color={color} />
            )}
          />
        </View>

        <BottomSheet
          height={"50%"}
          visible={showMoreBottomSheet}
          dismissable={true}
          mode={"full-width"}
          onDismiss={() => setshowMoreBottomSheet(false)}
        >
          <View className="px-2 mt-1 p-2 space-y-5 h-full">
            <Text className="text-lg font-bold">More Services</Text>

            <View className="space-y-2 px-1">
              

              <Card className="p-3">
                <View className="flex-row w-full items-center justify-between">
                  <ActionButton
                    onPress={() => router.push("/widthdraw")}
                    label="Widthdraw   "
                    icon={({ color }) => (
                      <FontAwesome name="bank" size={24} color={color} />
                    )}
                  />
                  <ActionButton
                    onPress={() => router.push("/earning")}
                    label="Earnning"
                    icon={({ color }) => (
                      <FontAwesome name="money" size={24} color={color} />
                    )}
                  />
                  <ActionButton
                    label="Sell Airtime"
                    onPress={() => router.push("/airtime2cash/airtime2cash")}
                    icon={({ color }) => (
                      <FontAwesome6
                        name="mobile-screen-button"
                        size={24}
                        color={color}
                      />
                    )}
                  />
                </View>
              </Card>
            </View>

            <View className="bottom-0 hidden w-full pt-10 px-5">
              <Button
                onPress={() => setshowMoreBottomSheet(false)}
                mode="outlined"
              >
                Close
              </Button>
            </View>
          </View>
        </BottomSheet>
      </View>
    </Card>
  );
};

export default ServicesContainer;
