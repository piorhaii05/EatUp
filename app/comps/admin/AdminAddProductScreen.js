import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../../navigation/config';

export default function AdminAddProduct({ navigation, route }) { 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const { reload } = route.params || {}; 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${linkapi}category`);
                const data = await res.json();
                if (res.ok) {
                    setCategories(data);
                } else {
                    Toast.show({ type: 'error', text1: 'Lỗi tải danh mục', text2: data.message || 'Không thể lấy danh mục.' });
                }
            } catch (err) {
                console.error('Lỗi khi tải danh mục:', err);
                Toast.show({ type: 'error', text1: 'Lỗi mạng', text2: 'Không thể kết nối để lấy danh mục.' });
            }
        };

        fetchCategories();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.cancelled) {
            setImage(result.assets[0]);
        }
    };

    const handleAddProduct = async () => {
        // --- Bắt đầu Validation ---
        if (!name || !price || !rating || !category) {
            Toast.show({ type: 'info', text1: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
            return;
        }

        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            Toast.show({ type: 'error', text1: 'Giá không hợp lệ', text2: 'Vui lòng nhập một số dương cho giá.' });
            return;
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
            Toast.show({ type: 'error', text1: 'Rating không hợp lệ', text2: 'Vui lòng nhập rating từ 0 đến 5.' });
            return;
        }
        // --- Kết thúc Validation ---

        const storedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(storedUser);
        const restaurantId = user._id;

        setLoading(true);

        let imageUrl = '';
        try {
            if (image) {
                const formData = new FormData();
                formData.append('image', {
                    uri: image.uri,
                    name: 'product.jpg',
                    type: 'image/jpg'
                });

                const resUpload = await fetch(`${linkapi}upload`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const dataUpload = await resUpload.json();
                
                if (dataUpload.url) {
                    imageUrl = dataUpload.url; 
                } else if (dataUpload.filename) {
                    // Cần kiểm tra lại cấu trúc linkapi của bạn để nối đúng đường dẫn
                    // Nếu linkapi là http://your-ip:port/api/ thì `/uploads/filename` sẽ thành http://your-ip:port/uploads/filename
                    // Đảm bảo server của bạn phục vụ các file tĩnh từ thư mục 'uploads'
                    const baseUrl = linkapi.endsWith('/') ? linkapi.slice(0, -1) : linkapi; // Xóa / cuối cùng nếu có
                    imageUrl = `${baseUrl}${dataUpload.url}`; // Sử dụng dataUpload.url nếu backend trả về /uploads/filename
                } else {
                    console.warn('Backend không trả về url hay filename sau khi upload.');
                }
            }

            const productData = {
                restaurant_id: restaurantId,
                name,
                description,
                price: numericPrice, // Sử dụng giá trị đã chuyển đổi số
                rating: numericRating, // Sử dụng giá trị đã chuyển đổi số
                image_url: imageUrl, 
                category
            };

            const resAddProduct = await fetch(`${linkapi}product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (resAddProduct.ok) {
                Toast.show({ type: 'success', text1: 'Đã thêm món ăn' });
                if (reload) {
                    reload(); 
                }
                navigation.goBack(); 
            } else {
                const errorData = await resAddProduct.json();
                Toast.show({ type: 'error', text1: 'Thêm món ăn thất bại', text2: errorData.message || 'Lỗi không xác định từ server' });
            }
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            Toast.show({ type: 'error', text1: 'Lỗi hệ thống', text2: err.message || 'Vui lòng thử lại sau' });
        }

        setLoading(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
                style={styles.customBackButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={28} color="#f55" /> 
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>

            {image ? (
                <Image source={{ uri: image.uri }} style={styles.image} />
            ) : (
                <View style={[styles.image, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Chưa chọn ảnh</Text>
                </View>
            )}

            <TouchableOpacity onPress={pickImage}>
                <Text style={{ color: '#f55', textAlign: 'center', marginVertical: 10 }}>Tải ảnh lên</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Loại món ăn(*)</Text>
            <View style={styles.pickerContainer}>
                <Picker 
                    selectedValue={category} 
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    <Picker.Item label="Chọn loại..." value="" />
                    {categories.map((cat) => (
                        <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Tên món ăn(*)</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Mô tả</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />

            <Text style={styles.label}>Giá(*)</Text>
            <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                keyboardType="numeric" // Đảm bảo bàn phím số
            />

            <Text style={styles.label}>Rating(*)</Text>
            <TextInput 
                style={styles.input} 
                value={rating} 
                onChangeText={setRating} 
                keyboardType="numeric" // Đảm bảo bàn phím số
            />

            {loading ? (
                <ActivityIndicator size="large" color="#f55" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                    <Text style={styles.buttonText}>Hoàn thành</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20
    },
    customBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 5,
        paddingRight: 10,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        marginLeft: 5,
        fontSize: 18,
        color: '#f55',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 10,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10
    },
    button: {
        backgroundColor: '#f55',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        height: 50,
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});