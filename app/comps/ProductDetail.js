import { Entypo, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../navigation/config';

export default function ProductDetail({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);
            setUserId(user?._id);
            if (user?._id) {
                checkFavorite(user._id);
            }
        };
        fetchUserId();
    }, []);

    const checkFavorite = async (user_id) => {
        try {
            const res = await fetch(linkapi + 'favorite/' + user_id);
            const data = await res.json();
            const exists = data.find(item => item.product_id === product._id);
            setIsFavorite(!!exists);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        if (!userId) return;

        try {
            if (isFavorite) {
                await fetch(linkapi + 'favorite/remove', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, product_id: product._id })
                });
            } else {
                await fetch(linkapi + 'favorite/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, product_id: product._id })
                });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async () => {
    if (!userId) return;

    try {
        await fetch(linkapi + 'cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                product_id: product._id,
                quantity: quantity
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


    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Entypo name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
                    <Entypo
                        name={isFavorite ? "heart" : "heart-outlined"}
                        size={24}
                        color={isFavorite ? "#f55" : "#000"}
                    />
                </TouchableOpacity>
            </View>

            <Image source={{ uri: linkanh + product.image_url }} style={styles.image} />

            <ScrollView>
                <View style={styles.infoContainer}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.name}>{product.name}</Text>
                    </View>

                    <Text style={styles.price}>{product.price} $</Text>
                    <Text style={styles.sold}>Đã bán: {product.purchases || 0}</Text>

                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>{product.rating}/5</Text>
                        <Entypo name="star" size={16} color="#FFD700" style={{ marginLeft: 4 }} />
                        <Text style={styles.ratingSmall}>(0 lượt đánh giá)</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Chi tiết</Text>
                    <Text style={styles.description}>{product.description || 'Không có mô tả'}</Text>

                    <View style={styles.quantityRow}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQuantity}>
                            <Text style={{ color: '#fff' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={increaseQuantity}>
                            <Text style={{ color: '#fff' }}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Đánh giá mẫu */}
                    <View style={styles.reviewSection}>
                        <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                        <View style={styles.reviewRow}>
                            <Image source={{ uri: 'https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg' }} style={styles.avatar} />
                            <View>
                                <Text style={styles.reviewer}>Nguyen Van A</Text>
                                <View style={styles.reviewRating}>
                                    {[...Array(5)].map((_, index) => (
                                        <Entypo key={index} name="star" size={14} color="#FFD700" />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <Text style={styles.reviewText}>Sản phẩm rất ngon và chất lượng!</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.total}>Tổng tiền: {(product.price * quantity).toFixed(2)} $</Text>
                <TouchableOpacity style={styles.addBtn} onPress={addToCart}>
                    <Feather name="shopping-cart" size={20} color="#fff" />
                    <Text style={styles.addText}> Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 15,
        zIndex: 10,
        position: 'absolute',
        width: '100%',
    },
    backBtn: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },
    favoriteBtn: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 250,
    },
    infoContainer: {
        padding: 15,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    time: {
        color: '#555',
    },
    price: {
        color: '#f55',
        fontSize: 18,
        marginVertical: 5,
        fontWeight: 'bold',
    },
    sold: {
        color: '#333',
        marginBottom: 5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    ratingSmall: {
        fontSize: 12,
        color: '#555',
        marginLeft: 5,
    },
    sectionTitle: {
        marginTop: 15,
        fontWeight: 'bold',
    },
    description: {
        color: '#555',
        marginTop: 5,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    qtyBtn: {
        backgroundColor: '#f55',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: 15,
        fontSize: 16,
    },
    reviewSection: {
        marginTop: 20,
    },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewer: {
        fontWeight: 'bold',
    },
    reviewRating: {
        flexDirection: 'row',
        marginTop: 2,
    },
    reviewText: {
        marginTop: 5,
        color: '#555',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    total: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addBtn: {
        backgroundColor: '#f55',
        padding: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
