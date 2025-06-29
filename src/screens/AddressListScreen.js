import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AddressCard from '../components/ui/AddressCard';

export default function AddressListScreen({ navigation }) {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0983276548',
      address: ' Hà Nội',
      city: '3456 Láng Hạ',
      district: 'Nam Từ Liêm',
      ward: 'Mỹ Đình',
      isDefault: true
    },
    {
      id: '2',
      name: 'Nguyễn Văn A',
      phone: '0983276548',
      address: ' 2344 Đường Láng',
      city: 'Hà Nội',
      district: 'Nam Từ Liêm',
      ward: 'Phú Đô',
      isDefault: false
    },
  ]);

  const handleEdit = (item) => navigation.navigate('EditAddress', { item });
  const handleDelete = (item) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== item.id));
          }
        }
      ]
    );
  };
  const handleSetDefault = (item, checked) => {
      setAddresses(prev =>
      prev.map(addr =>
        addr.id === item.id
          ? { ...addr, isDefault: checked }
          : { ...addr, isDefault: false }
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AddressCard
            name={item.name}
            phone={item.phone}
            address={item.address}
            isDefault={item.isDefault}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            onSetDefault={(checked) => handleSetDefault(item, checked)}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAddress')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 , backgroundColor: '#fff' },
  addButton: {
    position: 'absolute', bottom: 20, right: 20, backgroundColor: '#e57373',
    width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center'
  },
  addButtonText: { fontSize: 30, color: '#fff' }
});
