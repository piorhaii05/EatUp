import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { linkapi } from '../../navigation/config';

const ManageVoucherScreen = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const navigation = useNavigation();

  const [editCode, setEditCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDiscountType, setEditDiscountType] = useState('');
  const [editDiscountValue, setEditDiscountValue] = useState('');
  const [editMinOrderAmount, setEditMinOrderAmount] = useState('');
  const [editMaxDiscountAmount, setEditMaxDiscountAmount] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editUsageLimit, setEditUsageLimit] = useState('');

  const fetchVouchers = async () => {
    try {
      const restaurantId = await AsyncStorage.getItem('restaurant_id');
      if (!restaurantId) {
        setLoading(false);
        return;
      }
      const API_URL = linkapi + 'vouchers/by-restaurant/' + restaurantId;
      const response = await fetch(API_URL);
      const data = await response.json();
      setVouchers(data);
    } catch (error) {
      console.error('Lỗi khi tải voucher:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchVouchers();
    });
    return unsubscribe;
  }, [navigation]);

  const openEditModal = (voucher) => {
    setEditVoucher(voucher);
    setEditCode(voucher.code || '');
    setEditDescription(voucher.description || '');
    setEditDiscountType(voucher.discount_type || '');
    setEditDiscountValue(String(voucher.discount_value ?? ''));
    setEditMinOrderAmount(String(voucher.min_order_amount ?? ''));
    setEditMaxDiscountAmount(String(voucher.max_discount_amount ?? ''));
    setEditStartDate(voucher.start_date ? voucher.start_date.substring(0, 10) : '');
    setEditEndDate(voucher.end_date ? voucher.end_date.substring(0, 10) : '');
    setEditUsageLimit(String(voucher.usage_limit ?? ''));
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editVoucher) return;
    try {
      const response = await fetch(linkapi + 'vouchers/' + editVoucher._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editCode,
          description: editDescription,
          discount_type: editDiscountType,
          discount_value: Number(editDiscountValue),
          min_order_amount: Number(editMinOrderAmount),
          max_discount_amount: Number(editMaxDiscountAmount),
          start_date: editStartDate,
          end_date: editEndDate,
          usage_limit: Number(editUsageLimit)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setEditModalVisible(false);
        setEditVoucher(null);
        fetchVouchers();
        alert('Sửa voucher thành công!');
      } else {
        alert(data.message || 'Sửa voucher thất bại!');
      }
    } catch (error) {
      alert('Lỗi khi sửa voucher!');
    }
  };

  const handleDelete = (voucherId) => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc chắn muốn xoá voucher này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xoá", style: "destructive", onPress: async () => {
            try {
              const response = await fetch(linkapi + 'vouchers/' + voucherId, {
                method: 'DELETE',
              });
              const data = await response.json();
              if (response.ok) {
                alert("Xoá voucher thành công!");
                fetchVouchers();
              } else {
                alert(data.message || 'Xoá voucher thất bại!');
              }
            } catch (error) {
              alert('Lỗi khi xoá voucher!');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddVoucher')}>
        <Text style={styles.addButtonText}>Thêm Voucher</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#2e86de" />
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.voucherItem}>
              <Text style={styles.voucherCode}>{item.code}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
              <Text style={styles.detailText}>
                {item.discount_type === 'percentage'
                  ? `Giảm ${item.discount_value}%`
                  : `Giảm ${item.discount_value.toLocaleString()}đ`}
              </Text>
              <Text style={styles.detailText}>Đơn tối thiểu: {item.min_order_amount?.toLocaleString() || '0'}đ</Text>
              <Text style={styles.detailText}>Giảm tối đa: {item.max_discount_amount?.toLocaleString() || '0'}đ</Text>
              <Text style={styles.detailText}>HSD: {new Date(item.end_date).toLocaleDateString()}</Text>
              <Text style={styles.detailText}>Lượt dùng: {item.used_count}/{item.usage_limit ?? '∞'}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                  <Text style={styles.editButtonText}>🖊️ Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                  <Text style={styles.deleteButtonText}>✖️ Xoá</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          style={styles.list}
        />
      )}

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Sửa thông tin voucher</Text>

            <Text>Mã voucher</Text>
            <TextInput style={styles.input} value={editCode} onChangeText={setEditCode} placeholder="Mã voucher" />
            <Text>Mô tả</Text>
            <TextInput style={styles.input} value={editDescription} onChangeText={setEditDescription} placeholder="Mô tả" />
            <Text>Loại giảm</Text>
            <TextInput style={styles.input} value={editDiscountType} onChangeText={setEditDiscountType} placeholder="percentage/fixed" />
            <Text>Giá trị giảm</Text>
            <TextInput style={styles.input} value={editDiscountValue} onChangeText={setEditDiscountValue} placeholder="Giá trị giảm" keyboardType="numeric" />
            <Text>Đơn tối thiểu</Text>
            <TextInput style={styles.input} value={editMinOrderAmount} onChangeText={setEditMinOrderAmount} placeholder="Đơn tối thiểu" keyboardType="numeric" />
            <Text>Giảm tối đa</Text>
            <TextInput style={styles.input} value={editMaxDiscountAmount} onChangeText={setEditMaxDiscountAmount} placeholder="Giảm tối đa" keyboardType="numeric" />
            <Text>Ngày bắt đầu</Text>
            <TextInput style={styles.input} value={editStartDate} onChangeText={setEditStartDate} placeholder="YYYY-MM-DD" />
            <Text>Ngày hết hạn</Text>
            <TextInput style={styles.input} value={editEndDate} onChangeText={setEditEndDate} placeholder="YYYY-MM-DD" />
            <Text>Giới hạn lượt dùng</Text>
            <TextInput style={styles.input} value={editUsageLimit} onChangeText={setEditUsageLimit} placeholder="Giới hạn lượt dùng" keyboardType="numeric" />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleEditSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageVoucherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  addButton: {
    backgroundColor: '#2e86de',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  list: {
    flex: 1
  },
  voucherItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db'
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4
  },
  descriptionText: {
    color: '#555',
    fontSize: 14,
    marginBottom: 6
  },
  detailText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8
  },
  editButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    elevation: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  saveButton: {
    backgroundColor: '#2e86de',
    padding: 10,
    borderRadius: 8,
    width: 80,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 8,
    width: 80,
    alignItems: 'center'
  }
});
