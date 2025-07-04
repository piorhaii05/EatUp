import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh } from '../navigation/config';

export default function OrderDetailsScreen({ navigation, route }) {
    const [order, setOrder] = useState(route.params?.order || null);
    const [loading, setLoading] = useState(!order);
    const [error, setError] = useState(null);

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
    };

    const getStatusDisplay = (status) => {
        let style = styles.statusDefault;
        let text = status;
        switch (status) {
            case 'Pending':
                style = styles.statusPending;
                text = 'Đang chờ xác nhận';
                break;
            case 'Processing':
                style = styles.statusProcessing;
                text = 'Đang xử lý';
                break;
            case 'Delivered':
                style = styles.statusDelivered;
                text = 'Đã giao hàng';
                break;
            case 'Cancelled':
                style = styles.statusCancelled;
                text = 'Đã hủy';
                break;
            case 'paid':
                style = styles.statusDelivered;
                text = 'Đã thanh toán';
                break;
            default:
                text = status;
        }
        return { style, text };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f55" />
                <Text style={{ marginTop: 10, color: '#333' }}>Đang tải chi tiết đơn hàng...</Text>
            </View>
        );
    }

    if (error || !order) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lỗi: {error || 'Không tìm thấy thông tin đơn hàng.'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { style: statusStyle, text: statusText } = getStatusDisplay(order.status);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
                        <Text style={styles.infoValue}>#{order._id.slice(-6).toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <Text style={[styles.infoValue, statusStyle]}>{statusText}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt:</Text>
                        <Text style={styles.infoValue}>{formatDateTime(order.createdAt)}</Text>
                    </View>
                    {order.delivery_date && (
                         <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ngày giao:</Text>
                            <Text style={styles.infoValue}>{formatDateTime(order.delivery_date)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sản phẩm ({order.items.length})</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.productItem}>
                            {item.product_image && (
                                <Image source={{ uri: `${linkanh}${item.product_image}` }} style={styles.productImage} />
                            )}
                            <View style={styles.productInfoDetails}>
                                <Text style={styles.productNameDetails}>{item.product_name}</Text>
                                <Text style={styles.productQuantityDetails}>Số lượng: {item.quantity ?? 0}</Text>
                                <Text style={styles.productPriceDetails}>Giá: ${(item.price ?? 0).toFixed(2)}</Text>
                            </View>
             
                            <Text style={styles.productTotalPrice}>$ {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</Text>
                        </View>
                    ))} 
                </View>

                {/* Thông tin địa chỉ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    {order.address_id ? (
                        <>
                            <Text style={styles.addressText}>Người nhận: {order.address_id.name}</Text>
                            <Text style={styles.addressText}>SĐT: {order.address_id.phone}</Text>
                            <Text style={styles.addressText}>Địa chỉ: {order.address_id.street}, {order.address_id.ward}, {order.address_id.city}</Text>
                        </>
                    ) : (
                        <Text style={styles.addressText}>Không có địa chỉ được ghi nhận.</Text>
                    )}
                </View>

                {/* Thông tin thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <Text style={styles.paymentText}>{order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</Text>
                    {order.bank_id && (
                        <>
                            <Text style={styles.paymentDetailText}>Ngân hàng: {order.bank_id.card_holder} - {order.bank_id.card_number}</Text>
                            {/* Thêm các thông tin ngân hàng khác nếu muốn */}
                        </>
                    )}
                </View>

                {/* Tổng kết thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tổng kết thanh toán</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tổng tiền hàng:</Text>
                        {/* Sửa lỗi potential undefined cho item.price và item.quantity trong reduce */}
                        <Text style={styles.summaryValue}>
                            ${order.items.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0).toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                        {/* Sửa lỗi potential undefined cho order.shipping_fee */}
                        <Text style={styles.summaryValue}>${(order.shipping_fee ?? 0).toFixed(2)}</Text>
                    </View>
                    {/* Sửa lỗi potential undefined cho order.discount_amount và chỉ hiển thị khi > 0 */}
                    {(order.discount_amount ?? 0) > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Giảm giá:</Text>
                            <Text style={[styles.summaryValue, styles.discountText]}>-${(order.discount_amount ?? 0).toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={styles.summaryTotalRow}>
                        <Text style={styles.summaryTotalLabel}>Tổng thanh toán:</Text>
                        {/* Sửa lỗi potential undefined cho order.total_amount */}
                        <Text style={styles.summaryTotalValue}>${(order.total_amount ?? 0).toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
        marginRight: 34,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#f55',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    infoLabel: {
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    statusPending: { color: '#f97316' },
    statusProcessing: { color: '#2563eb' },
    statusDelivered: { color: '#16a34a' },
    statusCancelled: { color: '#dc2626' },
    statusDefault: { color: '#4b5563' },

    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#eee',
        resizeMode: 'cover',
    },
    productInfoDetails: {
        flex: 1,
    },
    productNameDetails: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    productQuantityDetails: {
        fontSize: 13,
        color: '#777',
    },
    productPriceDetails: {
        fontSize: 14,
        color: '#555',
    },
    productTotalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f55',
    },
    addressText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
    },
    paymentText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
    },
    paymentDetailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
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
    discountText: {
        color: '#16a34a',
    },
    summaryTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 10,
    },
    summaryTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f55',
    },
});