import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function VerifyAccountScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleVerify = () => {
    // xử lý xác minh tài khoản
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email hiện tại</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email hiện tại"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Đồng ý" onPress={handleVerify} color="#e57373" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 16 },
});
