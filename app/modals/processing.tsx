import { View, Text } from 'react-native'
import React from 'react'
import Processing from '@/components/models/Processing'

const processing = () => {
  return (
    <View className='flex-1'>
      <Processing visible={true} />
    </View>
  )
}

export default processing