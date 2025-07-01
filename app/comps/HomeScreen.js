import { Entypo, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../navigation/config';

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [highestRated, setHighestRated] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('Hồ Chí Minh');

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const userString = await AsyncStorage.getItem('user');
                if (userString) {
                    setUser(JSON.parse(userString));
                }
            };
            fetchUser();
        }, [])
    );

    useEffect(() => {
        fetchCategories();
        fetchHighestRated();
        fetchPopularItems();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(linkapi + 'category');
            const data = await res.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchHighestRated = async () => {
        try {
            const res = await fetch(linkapi + 'product/highest-rated');
            const data = await res.json();
            const filtered = data.filter(item => item.status === true && item.rating > 4.5);
            setHighestRated(filtered);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPopularItems = async () => {
        try {
            const res = await fetch(linkapi + 'product/popular');
            const data = await res.json();
            const filtered = data.filter(item => item.status === true);
            setPopularItems(filtered);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (product) => {
        try {
            if (!user?._id) {
                alert('Vui lòng đăng nhập lại!');
                return;
            }

            await fetch(linkapi + 'cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id: product._id,
                    quantity: 1
                })
            });
            Toast.show({
                type: 'success',
                text1: 'Đã thêm vào giỏ hàng!',
            });
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi thêm vào giỏ hàng!',
            });
        }
    };

    const renderProduct = (item) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <View style={styles.foodCard}>
                <Image source={{ uri: linkanh + item.image_url }} style={styles.foodImage} />
                <View style={styles.infoContainer}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.foodName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                        <Text style={styles.foodPrice}>{item.price} $</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoText}>{item.rating}/5</Text>
                            <Entypo name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                        </View>
                        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                            <Feather name="plus" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Text style={styles.labelText}>Khu vực</Text>
                <View style={styles.headerRow}>
                    <View style={styles.locationRow}>
                        <Entypo name="location-pin" size={25} color="#f55" />
                        <Picker
                            selectedValue={city}
                            style={{ height: 50, width: 160 }}
                            onValueChange={(itemValue) => setCity(itemValue)}
                        >
                            <Picker.Item label="Hồ Chí Minh" value="Hồ Chí Minh" />
                            <Picker.Item label="Hà Nội" value="Hà Nội" />
                            <Picker.Item label="Đà Nẵng" value="Đà Nẵng" />
                        </Picker>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                        <Feather name="shopping-cart" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchBox}>
                    <TextInput
                        placeholder="Tìm kiếm món ăn"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity>
                        <Feather name="filter" size={22} color="#f55" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 150, marginBottom: 15 }}>
                    <Swiper autoplay showsPagination>
                        <Image source={require('../../assets/images/BannerMain.png')} style={styles.banner} />
                        <Image source={require('../../assets/images/BannerMain1.jpg')} style={styles.banner} />
                        <Image source={require('../../assets/images/BannerMain2.jpg')} style={styles.banner} />
                    </Swiper>
                </View>

                <View style={styles.sectionRow}>
                    {loading ? <ActivityIndicator color="#f55" /> : (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={categories}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={{ alignItems: 'center', marginRight: 10 }}>
                                    <View style={[styles.categoryBox, { backgroundColor: item.color ? `#${item.color}` : '#FFCCCC' }]}>
                                        <Image source={{ uri: linkanh + item.image_url }} style={styles.categoryImage} />
                                    </View>
                                    <Text style={styles.categoryText}>{item.name}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>

                <View style={styles.popularRow}>
                    <Text style={styles.sectionTitle}>Đánh giá cao</Text>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={highestRated}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => renderProduct(item)}
                />

                <View style={styles.popularRow}>
                    <Text style={styles.sectionTitle}>Phổ biến</Text>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={popularItems}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => renderProduct(item)}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    searchBox: { flexDirection: 'row', borderWidth: 1, borderColor: '#f55', borderRadius: 25, paddingHorizontal: 15, alignItems: 'center', marginBottom: 15 },
    searchInput: { flex: 1, height: 40, color: '#000' },
    banner: { width: '100%', height: 150, borderRadius: 10, marginBottom: 15 },
    sectionRow: { marginBottom: 15 },
    categoryBox: { padding: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center', width: 70, height: 70 },
    categoryImage: { width: 40, height: 40 },
    categoryText: { color: '#000', fontWeight: '500', textAlign: 'center', marginTop: 5 },
    popularRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    foodCard: { width: 170, borderRadius: 12, backgroundColor: '#eee', marginRight: 15, overflow: 'hidden', position: 'relative' },
    foodImage: { width: '100%', height: 100 },
    infoContainer: { padding: 10, backgroundColor: '#eee' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    foodName: { fontSize: 15, fontWeight: 'bold', color: '#000', flex: 1, marginRight: 5 },
    foodPrice: { color: '#f55', fontWeight: 'bold', fontSize: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 12, color: '#555' },
    addBtn: { backgroundColor: '#f55', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    labelText: { fontSize: 18, fontWeight: 'bold' },
});
