import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { linkanh, linkapi } from '../navigation/config';

export default function CartScreen({ navigation }) {
    const [userId, setUserId] = useState(null);
    const [cart, setCart] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserId = async () => {
                const userString = await AsyncStorage.getItem('user');
                const user = JSON.parse(userString);
                setUserId(user?._id);
                if (user?._id) {
                    fetchCart(user._id);
                }
            };
            fetchUserId();
        }, [])
    );

    const fetchCart = async (user_id) => {
        try {
            const res = await fetch(linkapi + 'cart/' + user_id);
            const data = await res.json();
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const increaseQty = async (item) => {
        await updateQuantity(item.product_id, item.quantity + 1);
    };

    const decreaseQty = async (item) => {
        if (item.quantity > 1) {
            await updateQuantity(item.product_id, item.quantity - 1);
        }
    };

    const updateQuantity = async (product_id, quantity) => {
        try {
            await fetch(linkapi + 'cart/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, product_id, quantity })
            });
            fetchCart(userId);
        } catch (error) {
            console.error(error);
        }
    };

    const removeItem = async (product_id) => {
        try {
            await fetch(linkapi + 'cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, product_id })
            });
            fetchCart(userId);
        } catch (error) {
            console.error(error);
        }
    };

    const totalPrice = cart?.items.reduce((sum, item) => sum + (item.product_price || 0) * item.quantity, 0) || 0;

    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <Image source={{ uri: linkanh + item.product_image }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemPrice}>${item.product_price}</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => decreaseQty(item)} style={styles.qtyBtn}>
                        <Feather name="minus" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQty(item)} style={styles.qtyBtn}>
                        <Feather name="plus" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.product_id)}>
                <Feather name="x-circle" size={26} color="#f55" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Giỏ hàng</Text>
                </View>
            </View>


            <FlatList
                data={cart?.items || []}
                keyExtractor={(item) => item.product_id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            />

            <View style={styles.bottomRow}>
                <Text style={styles.totalText}>Tổng cộng:</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>THANH TOÁN</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    headerWrapper: {
        paddingTop: 30,  // Giúp nút quay lại không bị sát cạnh trên
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        padding: 8,
        marginRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },

    itemRow: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 },
    itemImage: { width: 80, height: 80, borderRadius: 10 },
    itemName: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
    itemPrice: { color: '#f55', fontWeight: '500', marginBottom: 10 },
    qtyRow: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: { backgroundColor: '#f55', padding: 6, borderRadius: 6 },
    qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
    totalText: { fontSize: 18 },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#f55' },
    checkoutBtn: { backgroundColor: '#f55', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }
});
