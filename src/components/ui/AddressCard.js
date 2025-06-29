import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function AddressCard({
  name,
  phone,
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.defaultRow}>
        <Checkbox value={isDefault} onValueChange={onSetDefault} color={isDefault ? "#ff7043" : undefined} />
        <Text style={styles.defaultText}>Đặt làm địa chỉ mặc định</Text>
      </View>

      <View style={styles.card}>
        {/* Dòng 1: Tên + icon */}
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="pencil-outline" size={18} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Dòng 2: Số điện thoại */}
        <Text style={styles.phone}>{phone}</Text>

        <View style={styles.divider} />

        {/* Dòng 3: Địa chỉ */}
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 2,
  },
  defaultText: { marginLeft: 6, fontSize: 14 },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 12 },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  phone: { fontSize: 14 },
  address: { fontSize: 14, color: '#444' },
});
