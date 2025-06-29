import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditPasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');

  const handleSave = () => {
    // xử lý đổi mật khẩu
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={20}
      />
      <Text style={styles.counter}>{password.length}/20</Text>
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
