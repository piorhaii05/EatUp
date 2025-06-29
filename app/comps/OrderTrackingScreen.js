import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrderTrackingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Theo dõi đơn hàng</Text>
    <FlatList data={[]} renderItem={() => <Text>Đơn hàng</Text>} />
  </View>
);

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});
