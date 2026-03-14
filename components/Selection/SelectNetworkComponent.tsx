import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Avatar, Button, IconButton, List, Text } from "react-native-paper";
import BottomSheet from "../models/BottomSheet";
import { useEffect, useState } from "react";
import { NetworksType } from "@/constants/Types";
import { Networks } from "@/constants/DemoList";




interface SelectNetworkComponentProps {
  onChangeText?: ((text: string) => void) | undefined
  onSelectNetwork: (data: {
    id: number;
    name: "mtn" | "airtel" | "glo" | "9mobile";
    icon: string;
  }) => void;
  
}
const SelectNetworkComponent = ({
  onSelectNetwork,
  onChangeText,
}: SelectNetworkComponentProps) => {
  const [selectNetworkVisible, setselectNetworkVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<{
    id: number;
    name: "mtn" | "airtel" | "glo" | "9mobile";
    icon: string;
  }>(Networks[0]);

  return (
    <View className="px-5">
      <View className="w-[100%] h-auto flex-row border rounded p-1 px-2">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setselectNetworkVisible(true)}
            className="w-[40px] h-[40px] rounded-full bg-slate-600"
          >
            <Avatar.Image
              size={40}
              source={{ uri: selectedNetwork?.icon, height: 40, width: 40 }}
            />
          </Pressable>
          <IconButton
            onPress={() => setselectNetworkVisible(true)}
            icon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
              />
            )}
          />
        </View>
        <TextInput
          onChangeText={onChangeText}
          style={{ fontSize: 18 }}
          className="h-full flex-1"
          keyboardType="numeric"
          placeholder="Mobile Number"
          maxLength={11}
        />
        <View>
          <IconButton icon={"contacts"} />
        </View>
      </View>
      <BottomSheet
        mode="full-width"
        height={"50%"}
        visible={selectNetworkVisible}
        onDismiss={() => setselectNetworkVisible(false)}
      >
        <View className="flex-1">
          <View className="p-3">
            <Text className="text-lg font-bold">Select Network</Text>
          </View>

          <ScrollView className="px-5 mb-[40px]">
            <List.Section>
              {Networks.map((network) => (
                <List.Item
                  key={network.id}
                  onPress={() => {
                    setselectNetworkVisible(false);
                    setSelectedNetwork(network);
                    onSelectNetwork(network);
                  }}
                  left={() => (
                    <Avatar.Image
                      size={40}
                      source={{ uri: network.icon, height: 40, width: 40 }}
                    />
                  )}
                  titleStyle={{ fontSize: 20, fontWeight: "bold" }}
                  title={network.name.toLocaleUpperCase()}
                />
              ))}
            </List.Section>
          </ScrollView>

          <View className="bottom-0 w-full mb-2 px-4 hidden">
            <Button
              onPress={() => setselectNetworkVisible(false)}
              mode="outlined"
            >
              Close
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default SelectNetworkComponent;
