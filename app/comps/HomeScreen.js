import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ActivityIndicator
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Swiper from 'react-native-swiper';
import { linkapi, linkanh } from '../navigation/config';

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('Hồ Chí Minh');

    useEffect(() => {
        fetchCategories();
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

    const fetchPopularItems = async () => {
        try {
            setLoading(true);
            const res = await fetch(linkapi + 'product/popular');
            const data = await res.json();
            setPopularItems(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Chọn thành phố + giỏ hàng */}
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
                    <TouchableOpacity>
                        <Feather name="shopping-cart" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Thanh tìm kiếm */}
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

                {/* Slide Banner */}
                <View style={{ height: 150, marginBottom: 15 }}>
                    <Swiper autoplay showsPagination>
                        <Image source={require('../../assets/images/BannerMain.png')} style={styles.banner} />
                        <Image source={require('../../assets/images/BannerMain1.jpg')} style={styles.banner} />
                        <Image source={require('../../assets/images/BannerMain2.jpg')} style={styles.banner} />
                    </Swiper>
                </View>

                {/* Danh mục loại đồ ăn */}
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
                                        <Image
                                            source={{ uri: linkanh + item.image_url }}
                                            style={styles.categoryImage}
                                        />
                                    </View>
                                    <Text style={styles.categoryText}>{item.name}</Text>
                                </View>
                            )}
                        />

                    )}
                </View>

                {/* Phổ biến */}
                <View style={styles.popularRow}>
                    <Text style={styles.sectionTitle}>Phổ biến</Text>
                    <TouchableOpacity onPress={fetchPopularItems}>
                        <Text style={styles.seeAll}>Làm mới</Text>
                    </TouchableOpacity>
                </View>

                {loading ? <ActivityIndicator color="#f55" /> : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={popularItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.foodCard}>
                                <Image source={{ uri: linkanh + item.image_url }} style={styles.foodImage} />
                                <Text style={styles.foodName}>{item.name}</Text>
                                <Text style={styles.foodPrice}>{item.price} VNĐ</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.rating}>{item.rating}/5 ⭐</Text>
                                    <Text style={styles.time}>{item.time}</Text>
                                </View>
                                <TouchableOpacity style={styles.addBtn}>
                                    <Feather name="plus" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#f55',
        borderRadius: 25,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#000',
    },
    banner: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    sectionRow: {
        marginBottom: 15,
    },
    categoryBox: {
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
    },
    categoryImage: {
        width: 40,
        height: 40,
    },
    categoryText: {
        color: '#000',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 5,
    },
    popularRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        color: '#f55',
        fontWeight: '500',
    },
    foodCard: {
        width: 160,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginRight: 15,
        position: 'relative',
    },
    foodImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    foodPrice: {
        color: '#f55',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating: {
        fontSize: 12,
    },
    time: {
        fontSize: 12,
    },
    addBtn: {
        backgroundColor: '#f55',
        padding: 8,
        borderRadius: 20,
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
