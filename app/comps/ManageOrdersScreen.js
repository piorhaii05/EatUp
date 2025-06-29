import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ManageOrdersScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Đơn hàng cửa hàng</Text>
    <FlatList data={[]} renderItem={() => <Text>Món ăn</Text>} />
  </View>
);

export default ManageOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});