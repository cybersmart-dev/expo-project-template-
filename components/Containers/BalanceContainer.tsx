import React from "react";
import { View } from "react-native";
import { Button, Icon, IconButton, Text } from "react-native-paper";

interface BalanceContainerProps {
  user?: Object;
  theme: any;
  hideBalance?: boolean;
  onHideBalanceToggle?: () => void;
}
const BalanceContainer = ({ user, theme, hideBalance, onHideBalanceToggle }: BalanceContainerProps) => {
  return (
    <View
      style={{ backgroundColor: theme.colors.primary }}
      className="relative h-[170px] w-full rounded-b-3xl mt-0  p-4"
    >
     
      <View>
        <View className="flex-row items-center">
          <Text className="opacity-75 text-[15px] mr-0 text-white">Account Balance</Text>
          <IconButton className="opacity-75" size={17} iconColor="white" icon={hideBalance ? "eye-off-outline" : "eye-outline"} onPress={onHideBalanceToggle} />
        </View>

        <View className="mt-2 flex-row items-center">
          {hideBalance ? (
            <Text className="text-3xl text-white font-semibold">****** </Text>
          ) : (
            <Text className="text-3xl text-white font-bold">₦119,300.30 </Text>
          )}
          
          
        </View>
      </View>
      
      <View className="absolute p-3 bottom-0 right-0 space-y-5 items-center">
       
        <Button buttonColor={theme.colors.onPrimary} textColor={theme.colors.primary} mode="contained" icon="plus">
          Add Money
        </Button>
      </View>
    </View>
  );
};

export default BalanceContainer;
