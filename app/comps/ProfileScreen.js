import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../navigation/config';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [loadingImageUpload, setLoadingImageUpload] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(userString);
                setUser(parsedUser);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng từ AsyncStorage:", error);
                Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải thông tin người dùng.' });
            }
        };
        fetchUser();
    }, []);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            console.log('Đường dẫn ảnh đã chọn:', selectedImageUri);
            await uploadImageAndSaveProfile(selectedImageUri);
        }
    };

    const uploadImageAndSaveProfile = async (imageUri) => {
        setLoadingImageUpload(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: imageUri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            });

            const uploadRes = await fetch(`${linkapi}upload`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error("Lỗi upload ảnh:", errorText);
                Toast.show({ type: 'error', text1: 'Tải ảnh thất bại', text2: 'Có lỗi khi tải ảnh lên server.' });
                setLoadingImageUpload(false);
                return;
            }

            const uploadData = await uploadRes.json();
            console.log('Dữ liệu upload trả về:', uploadData);

            let relativeAvatarUrl = ''; // Sẽ lưu đường dẫn tương đối
            if (uploadData.url) { // Backend trả về url tương đối (ví dụ: /uploads/filename.jpg)
                relativeAvatarUrl = uploadData.url; 
            } else if (uploadData.filename) { // Backend chỉ trả về filename
                relativeAvatarUrl = `/uploads/${uploadData.filename}`; 
            } else {
                Toast.show({ type: 'error', text1: 'Lỗi đường dẫn ảnh', text2: 'Server không trả về URL ảnh hợp lệ.' });
                setLoadingImageUpload(false);
                return;
            }

            // Cập nhật thông tin người dùng với avatar_url là đường dẫn tương đối
            const res = await fetch(`${linkapi}update/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar_url: relativeAvatarUrl }), // LƯU ĐƯỜNG DẪN TƯƠNG ĐỐI
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Lỗi cập nhật avatar:", errorData);
                Toast.show({ type: 'error', text1: 'Cập nhật avatar thất bại', text2: errorData.message || 'Lỗi không xác định.' });
                setLoadingImageUpload(false);
                return;
            }

            const updatedUser = await res.json();
            console.log("Người dùng đã cập nhật:", updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser); // State user sẽ có avatar_url là đường dẫn tương đối
            Toast.show({ type: 'success', text1: 'Ảnh đại diện đã được cập nhật!' });

        } catch (error) {
            console.error("Lỗi trong quá trình upload hoặc cập nhật profile:", error);
            Toast.show({ type: 'error', text1: 'Lỗi hệ thống', text2: 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.' });
        } finally {
            setLoadingImageUpload(false);
        }
    };


    const updateGender = async (selectedGender) => {
        try {
            const res = await fetch(linkapi + 'update/' + user._id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gender: selectedGender })
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                Toast.show({ type: 'error', text1: 'Cập nhật thất bại', text2: errorData.message || 'Lỗi không xác định từ server.' });
                return;
            }

            const updatedUser = await res.json();
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowGenderModal(false);
            Toast.show({ type: 'success', text1: 'Giới tính đã được cập nhật!' });
        } catch (error) {
            console.error("Lỗi khi cập nhật giới tính:", error);
            Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Cập nhật giới tính thất bại. Vui lòng thử lại.' });
        }
    };

    const handleLogout = async () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Đăng xuất',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('user');
                    navigation.replace('Login');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cài đặt</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            // Ghép linkanh với avatar_url nếu avatar_url là đường dẫn tương đối,
                            // hoặc sử dụng trực tiếp nếu nó đã là URL đầy đủ (ví dụ từ Google/FB login)
                            user?.avatar_url
                                ? { uri: user.avatar_url.startsWith('http') ? user.avatar_url : linkanh + user.avatar_url }
                                : require('../../assets/images/AVT.jpg')
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.changeAvatarBtn} onPress={handlePickImage} disabled={loadingImageUpload}>
                        {loadingImageUpload ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Feather name="edit" size={18} color="#000" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('EditNamePhone')}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Tên</Text>
                            <Text style={styles.value}>{user?.name || ''}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user?.email || ''}</Text>
                </View>

                <TouchableOpacity style={styles.infoBox} onPress={() => setShowGenderModal(true)}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Giới tính</Text>
                            <Text style={styles.value}>{user?.gender || 'Chưa cập nhật'}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('EditNamePhone')}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <Text style={styles.value}>{user?.phone || ''}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('AddressList')}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Địa chỉ nhận hàng</Text>
                            <Text style={styles.value}>Quản lý địa chỉ của bạn</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('BankList')}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Tài khoản ngân hàng</Text>
                            <Text style={styles.value}>Quản lý thẻ ngân hàng của bạn</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>Lịch sử đặt hàng</Text>
                    <Text style={styles.value}>Lịch sử và thông tin đơn hàng</Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>Đánh giá của tôi</Text>
                    <Text style={styles.value}>Chi tiết đánh giá sản phẩm của tôi</Text>
                </View>

                <TouchableOpacity style={styles.infoBox} onPress={() => navigation.navigate('ChangePassword')}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.label}>Mật khẩu</Text>
                            <Text style={styles.value}>********</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#888" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={18} color="#fff" />
                    <Text style={styles.logoutText}> Đăng xuất</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal chọn giới tính */}
            <Modal
                visible={showGenderModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowGenderModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn giới tính</Text>

                        {['Nam', 'Nữ', 'Khác'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.genderOption}
                                onPress={() => updateGender(option)}
                            >
                                <Text style={{ fontSize: 16 }}>{option}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowGenderModal(false)}>
                            <Text style={{ color: '#f55', fontWeight: 'bold' }}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 50 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    avatarContainer: { alignItems: 'center', marginBottom: 25 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
    changeAvatarBtn: { position: 'absolute', bottom: 10, right: 120, backgroundColor: '#fff', padding: 5, borderRadius: 15, elevation: 2 },
    infoBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15 },
    label: { fontSize: 14, color: '#555', marginBottom: 5 },
    value: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    logoutBtn: {
        marginTop: 30,
        backgroundColor: '#f55',
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    genderOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    cancelBtn: {
        marginTop: 15,
        alignItems: 'center',
    },
});