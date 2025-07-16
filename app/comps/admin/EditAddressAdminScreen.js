import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../../navigation/config'; // Đảm bảo đường dẫn đúng

export default function EditAddressAdminScreen({ navigation, route }) {
    // Nhận userId, address, userName và userPhone từ AdminProfileScreen
    const { userId, address, userName, userPhone } = route.params; // THAY ĐỔI Ở ĐÂY

    // Các state chỉ cho phép chỉnh sửa (city, ward, street)
    const [city, setCity] = useState(address?.city || '');
    const [ward, setWard] = useState(address?.ward || '');
    const [street, setStreet] = useState(address?.street || '');
    const [loading, setLoading] = useState(false);

    // Xác định xem đây là chế độ chỉnh sửa hay thêm mới
    const isEditing = !!address?._id;

    // Cập nhật state khi props `address` thay đổi
    useEffect(() => {
        setCity(address?.city || '');
        setWard(address?.ward || '');
        setStreet(address?.street || '');
    }, [address]);

    const handleSaveAddress = async () => {
        // Kiểm tra validation cơ bản (name và phone không cần kiểm tra vì không chỉnh sửa)
        if (!city.trim() || !ward.trim() || !street.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin địa chỉ (Tỉnh/TP, Phường/Xã, Đường/Số nhà).');
            return;
        }

        setLoading(true);
        try {
            let res;
            let method;
            let url;
            let bodyData = {
                // Sử dụng userName và userPhone được truyền vào, không phải từ state
                name: userName, // Lấy từ props
                phone: userPhone, // Lấy từ props
                city,
                ward,
                street
            };

            if (isEditing) {
                // Chế độ chỉnh sửa: Gọi API PUT để cập nhật địa chỉ theo ID
                url = `${linkapi}address/update/${address._id}`;
                method = 'PUT';
            } else {
                // Chế độ thêm mới: Gọi API POST để thêm địa chỉ mới
                url = `${linkapi}address/add`;
                method = 'POST';
                bodyData = { ...bodyData, user_id: userId, is_default: true };
            }

            res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(`Lỗi ${isEditing ? 'cập nhật' : 'thêm'} địa chỉ:`, res.status, errorData);
                throw new Error(errorData.message || `Không thể ${isEditing ? 'cập nhật' : 'thêm'} địa chỉ.`);
            }

            Toast.show({
                type: 'success',
                text1: `${isEditing ? 'Cập nhật' : 'Thêm'} địa chỉ thành công!`,
            });

            navigation.navigate('AdminProfile', { shouldRefreshAddress: true });

        } catch (error) {
            console.error(`Lỗi trong quá trình ${isEditing ? 'cập nhật' : 'thêm'} địa chỉ:`, error);
            Toast.show({ type: 'error', text1: 'Lỗi hệ thống', text2: error.message || `${isEditing ? 'Cập nhật' : 'Thêm'} địa chỉ thất bại. Vui lòng thử lại.` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>{isEditing ? 'Chỉnh sửa Địa chỉ Nhà hàng' : 'Thêm Địa chỉ Nhà hàng'}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Trường Tên người liên hệ - Chỉ hiển thị, không chỉnh sửa */}
                <Text style={styles.label}>Tên người liên hệ:</Text>
                <TextInput
                    style={styles.inputDisabled} // Dùng style riêng cho input bị disable
                    value={userName || ''} // Lấy từ props userName
                    editable={false} // Không cho phép chỉnh sửa
                />

                {/* Trường Số điện thoại liên hệ - Chỉ hiển thị, không chỉnh sửa */}
                <Text style={styles.label}>Số điện thoại liên hệ:</Text>
                <TextInput
                    style={styles.inputDisabled} // Dùng style riêng cho input bị disable
                    value={userPhone || ''} // Lấy từ props userPhone
                    editable={false} // Không cho phép chỉnh sửa
                    keyboardType="phone-pad"
                />

                {/* Các trường còn lại vẫn chỉnh sửa bình thường */}
                <Text style={styles.label}>Tỉnh/Thành phố:</Text>
                <TextInput
                    placeholder="Tỉnh/Thành phố*"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                />
                <Text style={styles.label}>Phường/Xã:</Text>
                <TextInput
                    placeholder="Phường/Xã*"
                    style={styles.input}
                    value={ward}
                    onChangeText={setWard}
                />
                <Text style={styles.label}>Tên đường, Tòa nhà, Số nhà:</Text>
                <TextInput
                    placeholder="Tên đường, Tòa nhà, Số nhà*"
                    style={styles.input}
                    value={street}
                    onChangeText={setStreet}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveText}>{isEditing ? 'Lưu Thay đổi' : 'Thêm Địa chỉ'}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, paddingTop: 50, backgroundColor: '#f0f2f5' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { padding: 5, marginRight: 10 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', flex: 1 },
    label: { // THÊM MỚI: Style cho label của input
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        marginTop: 10,
        marginLeft: 5,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputDisabled: { // THÊM MỚI: Style cho input bị disable
        borderWidth: 1.5,
        borderColor: '#e0e0e0', // Màu border nhạt hơn
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f5f5f5', // Màu nền xám nhạt
        color: '#a0a0a0', // Màu chữ xám
    },
    saveBtn: {
        backgroundColor: '#f55',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});