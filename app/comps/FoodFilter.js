import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const FoodFilter = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Lọc món ăn</Text>
    <Button title="Món chay" onPress={() => {}} />
    <Button title="Món nước" onPress={() => {}} />
  </View>
);

export default FoodFilter;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});