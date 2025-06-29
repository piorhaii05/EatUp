import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function AddAddressScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState(''); 
    const [ward, setWard] = useState('');

  const handleAdd = () => {
    // xử lý thêm mới
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Họ và tên*" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Số điện thoại*" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Tỉnh/Thành phố*" />
      <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="Quận/Huyện*" />
      <TextInput style={styles.input} value={ward} onChangeText={setWard} placeholder="Phường/Xã*" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Tên đường, Tòa nhà, Số nhà*" />
      <Button title="Tiếp tục" onPress={handleAdd} color="#e57373" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 16 },
});
