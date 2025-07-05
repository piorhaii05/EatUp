import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import {
    Alert,
    Image,
    Pressable, ScrollView,
    StyleSheet,
    Text, TextInput,
    View
} from 'react-native';

export default function EditFoodScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { food } = route.params; // Nhận dữ liệu từ màn trước
    const [form, setForm] = useState({
        id: food._id,
        ...food
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!form.name || !form.price || !form.type || !form.rating) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
            return;
        }

        fetch(`http://172.16.0.2:3000/api/product/${form.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Update thành công:', data);
                Alert.alert("Thành công", "Đã cập nhật món ăn.");
                navigation.goBack();
            })
            .catch(err => {
                console.error('❌ Update lỗi:', err);
                Alert.alert("Lỗi", "Không thể cập nhật món ăn.");
            });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerText}>Thay đổi món ăn</Text>
                <View style={{ width: 24 }} />
            </View>

            <Image source={{ uri: form.image_url }} style={styles.image} />
            <Text style={styles.upload}>Tải ảnh lên</Text>

            <Text style={styles.label}>Loại món ăn(*)</Text>
            <TextInput
                style={styles.input}
                value={form.type}
                onChangeText={(text) => handleChange('type', text)}
            />

            <Text style={styles.label}>Tên món ăn(*)</Text>
            <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
            />

            <Text style={styles.label}>Mô tả (*)</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={form.description}
                multiline
                onChangeText={(text) => handleChange('description', text)}
            />

            <Text style={styles.label}>Giá(*)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.price)}
                onChangeText={(text) => {
                    const value = parseFloat(text);
                    handleChange('price', isNaN(value) ? 0 : value);
                }}
            />

            <Text style={styles.label}>Rating(*)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(form.rating)}
                onChangeText={(text) => handleChange('rating', parseFloat(text))}
            />

            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Hoàn thành</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#ec1562', padding: 12
    },
    headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    image: { width: '100%', height: 180, marginTop: 10 },
    upload: { textAlign: 'center', color: '#888', marginVertical: 6 },
    label: { marginHorizontal: 16, marginTop: 12, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        padding: 10, marginHorizontal: 16, marginTop: 6
    },
    submitBtn: {
        backgroundColor: '#ec1562', margin: 20, padding: 12, borderRadius: 30,
        alignItems: 'center'
    },
    submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});