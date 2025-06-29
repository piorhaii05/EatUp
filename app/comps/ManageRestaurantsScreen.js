import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ManageRestaurantsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Quản lý cửa hàng</Text>
    <FlatList data={[]} renderItem={() => <Text>Nhà hàng</Text>} />
  </View>
);

export default ManageRestaurantsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});