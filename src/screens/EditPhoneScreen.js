import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    // xử lý lưu số điện thoại mới
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <Text style={styles.counter}>{phone.length}/10</Text>
      <Button title="Lưu" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 4 },
  counter: { alignSelf: 'flex-end', marginBottom: 16, color: 'gray' },
});
