import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../navigation/config';

export default function EditAddressScreen({ route, navigation }) {
    const { address } = route.params;

    const [city, setCity] = useState(address.city);
    const [ward, setWard] = useState(address.ward);
    const [street, setStreet] = useState(address.street);

    const handleUpdateAddress = async () => {
        if (!city || !ward || !street) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            await fetch(linkapi + 'address/update/' + address._id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, ward, street })
            });

            Toast.show({
                type: 'success',
                text1: 'Cập nhật địa chỉ thành công!',
            });

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Cập nhật địa chỉ thất bại');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Chỉnh sửa địa chỉ</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                    style={[styles.input, { backgroundColor: '#eee' }]}
                    value={address.name}
                    editable={false}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: '#eee' }]}
                    value={address.phone}
                    editable={false}
                />
                <TextInput
                    placeholder="Tỉnh/Thành phố*"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    placeholder="Phường/Xã*"
                    style={styles.input}
                    value={ward}
                    onChangeText={setWard}
                />
                <TextInput
                    placeholder="Tên đường, Tòa nhà, Số nhà*"
                    style={styles.input}
                    value={street}
                    onChangeText={setStreet}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateAddress}>
                    <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { padding: 5, marginRight: 10 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    input: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 18,
        marginBottom: 20,
        fontSize: 16,
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
