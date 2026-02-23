import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActionButton = () => {
  return (
    <View style={styles.container}>
      <Text>ActionButton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActionButton;