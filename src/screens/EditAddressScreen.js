import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditAddressScreen({ route, navigation }) {
  const { item } = route.params;
  const [name, setName] = useState(item.name);
  const [phone, setPhone] = useState(item.phone);
  const [address, setAddress] = useState(item.address);
  const [city, setCity] = useState(item.city);
  const [district, setDistrict] = useState(item.district); 
  const [ward, setWard] = useState(item.ward);
  const handleSave = () => {
  
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
                  <Button title="Lưu thay đổi" onPress={handleSave} color="#e57373" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 16 },
});
