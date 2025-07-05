import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../navigation/config';

export default function EditNamePhoneScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem('user');
            const parsedUser = JSON.parse(userString);
            setUser(parsedUser);
            setName(parsedUser?.name || '');
            setPhone(parsedUser?.phone || '');
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        if (!name.trim() || !phone.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await fetch(linkapi + 'update/' + user._id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            });

            const updatedUser = await res.json();
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

            Toast.show({
                type: 'success',
                text1: 'Cập nhật thành công!',
            });

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Cập nhật thất bại');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông tin cá nhân</Text>
            </View>

            <View style={{ flex: 1 }}>
                <TextInput
                    placeholder="Họ và tên"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    maxLength={30}
                />
                <Text style={styles.counter}>{name.length}/30</Text>

                <TextInput
                    placeholder="Số điện thoại"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={15}
                />
                <Text style={styles.counter}>{phone.length}/15</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>LƯU</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, paddingTop: 50, backgroundColor: '#fff' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { padding: 5, marginRight: 10 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    input: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 18,
        marginBottom: 10,
        fontSize: 16,
    },
    counter: { textAlign: 'right', color: '#555', marginBottom: 15 },
    saveBtn: {
        backgroundColor: '#f55',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
