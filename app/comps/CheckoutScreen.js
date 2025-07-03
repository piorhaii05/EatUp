import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../navigation/config';

export default function CheckoutScreen({ navigation, route }) {
    const [userId, setUserId] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [defaultBank, setDefaultBank] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' (5$)
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' (Cash on Delivery) hoặc 'bank'

    useFocusEffect(
        useCallback(() => {
            const fetchInitialData = async () => {
                setLoading(true);
                try {
                    const userString = await AsyncStorage.getItem('user');
                    const user = JSON.parse(userString);
                    if (user?._id) {
                        setUserId(user._id);
                        await Promise.all([
                            fetchDefaultAddress(user._id),
                            fetchDefaultBank(user._id),
                            fetchCartItems(user._id)
                        ]);
                    } else {
                        setUserId(null);
                        setDefaultAddress(null);
                        setDefaultBank(null);
                        setCartItems([]);
                        Toast.show({ type: 'error', text1: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' });
                    }
                } catch (error) {
                    console.error("Lỗi khi tải dữ liệu ban đầu:", error);
                    Toast.show({ type: 'error', text1: 'Không thể tải dữ liệu ban đầu. Vui lòng thử lại.' });
                } finally {
                    setLoading(false);
                }
            };
            fetchInitialData();
        }, [])
    );

    const fetchDefaultAddress = async (id) => {
        try {
            const res = await fetch(`${linkapi}address/default/${id}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
            }
            const data = await res.json();
            if (data && Object.keys(data).length > 0) {
                setDefaultAddress(data);
            } else {
                setDefaultAddress(null);
            }
        } catch (error) {
            console.error("Lỗi khi lấy địa chỉ mặc định:", error);
            setDefaultAddress(null);
        }
    };

    const fetchDefaultBank = async (id) => {
        try {
            const res = await fetch(`${linkapi}bank/default/${id}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
            }
            const data = await res.json();
            if (data && Object.keys(data).length > 0) {
                setDefaultBank(data);
            } else {
                setDefaultBank(null);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thẻ ngân hàng mặc định:", error);
            setDefaultBank(null);
        }
    };

    const fetchCartItems = async (id) => {
        try {
            const res = await fetch(`${linkapi}cart/${id}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
            }
            const data = await res.json();
            setCartItems(data?.items || []);
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng:", error);
            Toast.show({ type: 'error', text1: 'Không thể tải các mặt hàng trong giỏ.' });
            setCartItems([]);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    };

    const shippingFee = 5.00;
    const discount = 0.00;

    const subtotal = calculateSubtotal();
    const totalAmount = subtotal + shippingFee - discount;

    const handleCheckout = async () => {
        const restaurantId = cartItems[0]?.restaurant_id;

        if (!userId) {
            Toast.show({ type: 'error', text1: 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.' });
            return;
        }
        if (!defaultAddress) {
            Toast.show({ type: 'error', text1: 'Vui lòng chọn địa chỉ nhận hàng.' });
            return;
        }
        if (paymentMethod === 'bank' && !defaultBank) {
            Toast.show({ type: 'error', text1: 'Vui lòng chọn thẻ ngân hàng hoặc phương thức COD.' });
            return;
        }
        if (cartItems.length === 0) {
            Toast.show({ type: 'error', text1: 'Giỏ hàng của bạn đang trống.' });
            return;
        }

        Alert.alert(
            'Xác nhận thanh toán',
            `Tổng thanh toán: $${totalAmount.toFixed(2)}\nBạn có chắc chắn muốn đặt hàng?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const orderData = {
                                user_id: userId,
                                restaurant_id: restaurantId,
                                address_id: defaultAddress._id,
                                payment_method: paymentMethod === 'cod' ? 'COD' : 'Bank Transfer',
                                bank_id: paymentMethod === 'bank' ? defaultBank?._id : null,
                                items: cartItems.map(item => ({
                                    product_id: item.product_id,
                                    quantity: item.quantity,
                                    price_at_order: item.product_price
                                })),
                                total_amount: totalAmount,
                                shipping_fee: shippingFee,
                                discount_amount: discount,
                                status: 'Pending'
                            };

                            const res = await fetch(`${linkapi}order/create`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(orderData),
                            });

                            if (!res.ok) {
                                const errorData = await res.json();
                                Toast.show({ type: 'error', text1: 'Đặt hàng thất bại', text2: errorData.message || 'Có lỗi xảy ra khi tạo đơn hàng.' });
                                setLoading(false);
                                return;
                            }

                            const result = await res.json();
                            Toast.show({ type: 'success', text1: 'Đặt hàng thành công!', text2: 'Đơn hàng của bạn đang được xử lý.' });
                            console.log('Order successful:', result);

                            // Assuming you have a route to clear the cart for a user
                            await fetch(`${linkapi}cart/clear/${userId}`, { method: 'DELETE' });

                            navigation.replace('OrderSuccess');
                        } catch (error) {
                            console.error("Lỗi khi xử lý thanh toán:", error);
                            Toast.show({ type: 'error', text1: 'Lỗi hệ thống', text2: 'Không thể xử lý đơn hàng. Vui lòng thử lại.' });
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f55" />
                <Text style={{ marginTop: 10 }}>Đang tải thông tin...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Địa chỉ nhận hàng */}
                <TouchableOpacity
                    style={styles.sectionContainer}
                    onPress={() => navigation.navigate('AddressList', { fromCheckout: true, selectedAddressId: defaultAddress?._id })}
                >
                    <View style={styles.sectionHeader}>
                        <Feather name="map-pin" size={20} color="#f55" /><Text style={styles.sectionTitle}> Địa chỉ nhận hàng</Text>
                        <Feather name="chevron-right" size={20} color="#888" style={{ marginLeft: 'auto' }} />
                    </View>
                    {defaultAddress ? (
                        <View style={styles.addressDetails}>
                            <Text style={styles.addressName}>{defaultAddress.name} (+{defaultAddress.phone})</Text>
                            <Text style={styles.addressText}>
                                {defaultAddress.street}, {defaultAddress.ward}, {defaultAddress.city}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.noDataText}>Chưa có địa chỉ mặc định. Vui lòng thêm!</Text>
                    )}
                </TouchableOpacity>

                {/* Phương pháp vận chuyển */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Phương pháp vận chuyển</Text>
                    <TouchableOpacity
                        style={styles.shippingOption}
                        onPress={() => setShippingMethod('standard')}
                    >
                        <View style={styles.radio}>
                            <View style={shippingMethod === 'standard' ? styles.radioSelected : styles.radioUnselected} />
                        </View>
                        <View style={styles.shippingMethodInfo}>
                            <Text style={styles.shippingMethodText}>Giao hàng tiêu chuẩn</Text>
                            <Text style={styles.shippingTime}>3-5 ngày</Text>
                        </View>
                        <Text style={styles.shippingPrice}>$5.00</Text>
                    </TouchableOpacity>
                </View>

                {/* Phương thức thanh toán */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    {/* Thanh toán khi nhận hàng */}
                    <TouchableOpacity style={styles.paymentMethodRow} onPress={() => setPaymentMethod('cod')}>
                        <View style={styles.radio}>
                            <View style={paymentMethod === 'cod' ? styles.radioSelected : styles.radioUnselected} />
                        </View>
                        <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
                    </TouchableOpacity>

                    {/* Thẻ/Tài khoản ngân hàng */}
                    <View>
                        <TouchableOpacity
                            style={styles.paymentMethodRow}
                            onPress={() => {
                                setPaymentMethod('bank');
                            }}
                        >
                            <View style={styles.radio}>
                                <View style={paymentMethod === 'bank' ? styles.radioSelected : styles.radioUnselected} />
                            </View>
                            <Text style={styles.paymentMethodText}>Thẻ/Tài khoản ngân hàng</Text>
                        </TouchableOpacity>

                        {paymentMethod === 'bank' && defaultBank ? (
                            <TouchableOpacity
                                style={styles.bankCardDisplay}
                                onPress={() => navigation.navigate('BankList', { fromCheckout: true, selectedBankId: defaultBank?._id })}
                            >
                                <Image source={require('../../assets/images/mastercard.png')} style={styles.bankCardIcon} /><Text style={styles.bankCardNumber}> **** **** **** {String(defaultBank.card_number).slice(-4)}</Text>

                                <View style={styles.editBankBtnContainer}>
                                    <Feather name="edit" size={16} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        ) : paymentMethod === 'bank' && !defaultBank ? (
                            <Text style={styles.noDataTextBank}>Chưa có thẻ mặc định. Vui lòng thêm!</Text>
                        ) : null}
                    </View>
                </View>

                {/* Áp dụng phiếu giảm giá */}
                <TouchableOpacity style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Feather name="tag" size={20} color="#f55" /><Text style={styles.sectionTitle}> Áp dụng phiếu giảm giá</Text><Text style={styles.discountCount}>0 Phiếu giảm giá</Text>
                        <Feather name="chevron-right" size={20} color="#888" style={{ marginLeft: 5 }} />
                    </View>
                </TouchableOpacity>

                {/* Các mặt hàng đã đặt */}
                <TouchableOpacity style={styles.sectionContainer} onPress={() => navigation.navigate('Cart')}>
                    <View style={styles.sectionHeader}>
                        <Feather name="shopping-bag" size={20} color="#f55" /><Text style={styles.sectionTitle}> Các mặt hàng đã đặt</Text><Text style={styles.itemCount}>{cartItems.length} mục</Text>
                        <Feather name="chevron-right" size={20} color="#888" style={{ marginLeft: 5 }} />
                    </View>
                </TouchableOpacity>

                {/* Tổng kết thanh toán */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tổng phụ ({cartItems.length} mục):</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                        <Text style={styles.summaryValue}>${shippingFee.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Giảm giá:</Text>
                        <Text style={styles.summaryValue}>-${discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                        <Text style={styles.finalTotalPrice}>${totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Nút THANH TOÁN cuối màn hình */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.checkoutButtonText}>THANH TOÁN</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 5, paddingTop: 50, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },

    backBtn: { padding: 5, marginRight: 10, paddingLeft: 15 },

    backButton: {
        marginRight: 15,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },

    scrollViewContent: {
        padding: 15,
        paddingBottom: 100,
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    addressDetails: {
        marginTop: 5,
        paddingLeft: 25,
    },
    addressName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    addressText: {
        fontSize: 14,
        color: '#555',
    },
    noDataText: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 5,
        paddingLeft: 25,
    },
    shippingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 5,
        width: '100%',
    },
    shippingMethodInfo: {
        flex: 1,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#f55',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    radioSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#f55',
    },
    radioUnselected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    shippingMethodText: {
        fontSize: 15,
        fontWeight: '500',
    },
    shippingTime: {
        fontSize: 13,
        color: '#888',
    },
    shippingPrice: {
        marginLeft: 'auto',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#f55',
    },
    // Thay đổi từ paymentOption sang paymentMethodRow cho hàng chứa radio và text
    paymentMethodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 5,
        // Loại bỏ flexWrap ở đây để nó chỉ áp dụng cho dòng này
    },
    paymentMethodText: {
        fontSize: 15,
        fontWeight: '500',
        marginRight: 10,
    },
    bankCardDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        // Đẩy sang phải và thêm khoảng cách top
        marginLeft: 'auto',
        marginTop: 10, // Thêm margin-top để đẩy xuống dưới
        // flex: 1, // Để nó có thể co giãn
        maxWidth: '60%', // Giới hạn chiều rộng để không tràn ra ngoài
    },
    bankCardIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 8,
    },
    bankCardNumber: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
    editBankBtnContainer: { // Thay đổi từ editBankBtn để chứa icon, không phải TouchableOpacity
        marginLeft: 5,
    },
    noDataTextBank: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        marginLeft: 35, // căn chỉnh với radio button
        marginTop: 5, // Đẩy xuống dưới một chút
    },
    discountCount: {
        marginLeft: 'auto',
        fontSize: 14,
        color: '#555',
    },
    itemCount: {
        marginLeft: 'auto',
        fontSize: 14,
        color: '#555',
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#555',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    finalTotalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f55',
    },
    checkoutButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f55',
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
});