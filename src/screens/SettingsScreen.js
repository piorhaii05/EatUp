import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Nguyễn Văn A</Text>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditName')}>
        <Text style={styles.label}>Tên</Text>
        <Text style={styles.value}>Nguyễn Văn A</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>nguyenvana@gmail.com</Text>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditPhone')}>
        <Text style={styles.label}>Số điện thoại</Text>
        <Text style={styles.value}>0983276548</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('VerifyAccount')}>
        <Text style={styles.label}>Xác minh tài khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditPassword')}>
        <Text style={styles.label}>Mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  avatarContainer: { alignItems: 'center', padding: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ddd' },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 16, fontWeight: '500' },
  value: { fontSize: 14, color: 'gray', marginTop: 4 },
});
