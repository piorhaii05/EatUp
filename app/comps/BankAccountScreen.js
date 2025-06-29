import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const BankAccountScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Tài khoản ngân hàng</Text>
    <Button title="Thêm tài khoản" onPress={() => {}} />
    <FlatList data={[]} renderItem={() => <Text>Tài khoản</Text>} />
  </View>
);

export default BankAccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});