import { View, Text } from 'react-native'
import React from 'react'
import { PaperSafeView } from '@/components/PaperView'
import { Appbar, useTheme } from 'react-native-paper'
import { router } from 'expo-router'

const transactions = () => {
  const theme = useTheme()
  return (
    <PaperSafeView>
      <View>
        <Appbar style={{ backgroundColor: theme.colors.primary }}>
          <Appbar.Content color='white' title="Transactions" />
          <Appbar.Action color="white" icon={"filter"} onPress={() => null} />
        </Appbar>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No transactions yet</Text>
      </View>
    </PaperSafeView>
  )
}

export default transactions