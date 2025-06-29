import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AddressItem from '../../components/ui/AddressItem';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileHeader} onPress={() => navigation.navigate('Settings')}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>Người dùng mới</Text>
          <Text style={styles.email}>nguyenvana@gmail.com</Text>
        </View>
      </TouchableOpacity>

      

      <AddressItem title={'Lịch sử đặt hàng'}
          subtitle={'Lịch sử và thông tin đơn hàng'} />
      <AddressItem title={ 'Địa chỉ nhận hàng' }
        subtitle={'Chưa có địa chỉ nào'}
        onPress={() => navigation.navigate('AddressList')}/>

    <AddressItem title={'Đánh giá của tôi'}
        subtitle={'Chi tiết đánh giá sản phẩm'}/>
        <AddressItem title={'Tài khoản ngân hàng'}
        subtitle={'1 tài khoản liên kết'}/>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd', marginRight: 16 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: 'gray' },
  item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16 },
});
