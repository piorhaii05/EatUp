import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PromoNotificationScreen = () => (
  <View style={styles.container}>
    <Text style={styles.header}>Gửi thông báo khuyến mãi</Text>
    <TextInput placeholder="Nội dung thông báo" style={styles.input} />
    <Button title="Gửi" onPress={() => {}} />
  </View>
);

export default PromoNotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 }
});
