import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RevenueStatisticsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Thống kê doanh thu toàn sàn</Text>
    <Text>Chọn ngày:</Text>
    <TextInput placeholder="YYYY-MM-DD" style={styles.input} />
    <Button title="Xem doanh thu" onPress={() => {}} />
  </View>
);

export default RevenueStatisticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 }
});
