import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditNameScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    // xử lý lưu tên mới
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên mới"
        value={name}
        onChangeText={setName}
        maxLength={30}
      />
      <Text style={styles.counter}>{name.length}/30</Text>
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
