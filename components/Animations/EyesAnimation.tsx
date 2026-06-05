import { View } from 'react-native'
import React from 'react'
import { Text, useTheme } from 'react-native-paper'

const EyesAnimation = () => {
    const theme = useTheme()
  return (
    <View>
          <View>
              <View className='h-[20px] w-[100px] bg-white rounded-tr-[300px] rounded-tl-[500px]'></View>
              <View className='h-[20px] w-[100px] bg-white rounded-br-[300px] rounded-bl-[500px]'></View>
          </View>
          <View></View>
    </View>
  )
}

export default EyesAnimation