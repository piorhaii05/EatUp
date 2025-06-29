import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    if (email === 'admin@example.com' && password === '123456') {
      Alert.alert('Thành công', 'Đăng nhập thành công');
      navigation.navigate('PromoNotification'); 
    } else {
      Alert.alert('Thất bại', 'Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng nhập Admin</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};

export default AdminLoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
