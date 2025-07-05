import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { linkanh, linkapi } from '../navigation/config';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [showGenderModal, setShowGenderModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem('user');
            const parsedUser = JSON.parse(userString);
            setUser(parsedUser);
        };
        fetchUser();
    }, []);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            console.log('Đường dẫn ảnh:', result.assets[0].uri);
            // Sau này xử lý upload lên server tại đây nếu muốn
        }
    };

    const updateGender = async (selectedGender) => {
        try {
            const res = await fetch(linkapi + 'update/' + user._id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gender: selectedGender })
            });
            const updatedUser = await res.json();
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowGenderModal(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Cập nhật thất bại');
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
                            user?.avatar_url
                                ? { uri: linkanh + user.avatar_url }
                                : require('../../assets/images/AVT.jpg')
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.changeAvatarBtn} onPress={handlePickImage}>
                        <Feather name="edit" size={18} color="#000" />
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
