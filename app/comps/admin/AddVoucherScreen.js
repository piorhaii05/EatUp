import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity
} from 'react-native';
import { linkapi } from '../../navigation/config';

const AddVoucherScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const handleAddVoucher = async () => {
    const restaurant_id = await AsyncStorage.getItem('restaurant_id');
    if (!restaurant_id) {
      Alert.alert('Lỗi', 'Không tìm thấy nhà hàng!');
      return;
    }

    try {
      const response = await fetch(linkapi + 'vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          description,
          discount_type: discountType,
          discount_value: Number(discountValue),
          min_order_amount: Number(minOrderAmount),
          max_discount_amount: Number(maxDiscountAmount),
          start_date: startDate,
          end_date: endDate,
          usage_limit: Number(usageLimit),
          restaurant_id
        })
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('✅ Thành công', 'Đã thêm voucher mới!');
        navigation.goBack();
      } else {
        Alert.alert('❌ Lỗi', data.message || 'Không thể thêm voucher');
      }
    } catch (error) {
      console.error('Add voucher error:', error);
      Alert.alert('❌ Lỗi', 'Không thể thêm voucher!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Thêm Voucher Mới</Text>

      <TextInput style={styles.input} placeholder="Mã voucher" value={code} onChangeText={setCode} />
      <TextInput style={styles.input} placeholder="Mô tả" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Loại giảm (percentage/fixed)" value={discountType} onChangeText={setDiscountType} />
      <TextInput style={styles.input} placeholder="Giá trị giảm" keyboardType="numeric" value={discountValue} onChangeText={setDiscountValue} />
      <TextInput style={styles.input} placeholder="Đơn tối thiểu" keyboardType="numeric" value={minOrderAmount} onChangeText={setMinOrderAmount} />
      <TextInput style={styles.input} placeholder="Giảm tối đa" keyboardType="numeric" value={maxDiscountAmount} onChangeText={setMaxDiscountAmount} />
      <TextInput style={styles.input} placeholder="Ngày bắt đầu (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
      <TextInput style={styles.input} placeholder="Ngày kết thúc (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} />
      <TextInput style={styles.input} placeholder="Giới hạn lượt dùng" keyboardType="numeric" value={usageLimit} onChangeText={setUsageLimit} />

      <TouchableOpacity style={styles.button} onPress={handleAddVoucher}>
        <Text style={styles.buttonText}>Thêm Voucher</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddVoucherScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f7f9fc',
    flexGrow: 1
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  }
});
