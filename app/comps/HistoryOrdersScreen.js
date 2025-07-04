import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert // Import Alert để hiển thị hộp thoại xác nhận
    ,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../navigation/config'; // Đảm bảo đường dẫn đúng

export default function HistoryOrdersScreen({ navigation, route }) {
    const [userId, setUserId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const initialOrderId = route.params?.orderId;

    const fetchUserAndOrders = useCallback(async () => {
        setLoading(true);
        try {
            const userString = await AsyncStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;

            if (user?._id) {
                setUserId(user._id);
                await fetchOrders(user._id);
            } else {
                setUserId(null);
                setOrders([]);
                Toast.show({ type: 'error', text1: 'Lỗi xác thực', text2: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' });
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            Toast.show({ type: 'error', text1: 'Lỗi hệ thống', text2: 'Không thể tải thông tin người dùng.' });
            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const fetchOrders = async (id) => {
        try {
            const res = await fetch(`${linkapi}order/user/${id}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Lỗi HTTP! trạng thái: ${res.status}`);
            }
            const data = await res.json();
            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);

        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error.message);
            Toast.show({ type: 'error', text1: 'Tải đơn hàng thất bại', text2: error.message || 'Không thể tải lịch sử đơn hàng. Vui lòng thử lại.' });
            setOrders([]);
        }
    };

    // HÀM HỦY ĐƠN HÀNG MỚI
    const cancelOrder = async (orderId) => {
        Alert.alert(
            "Xác nhận hủy đơn hàng",
            "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
            [
                {
                    text: "Không",
                    style: "cancel"
                },
                {
                    text: "Có",
                    onPress: async () => {
                        try {
                            setLoading(true); // Có thể hiển thị loading nhỏ hơn hoặc toast
                            const res = await fetch(`${linkapi}order/cancel/${orderId}`, {
                                method: 'PUT', // Hoặc 'DELETE' tùy theo API con thiết kế
                                headers: {
                                    'Content-Type': 'application/json',
                                    // Thêm token xác thực nếu cần
                                },
                                // body: JSON.stringify({ status: 'Cancelled' }) // Có thể gửi trạng thái mới trong body nếu API yêu cầu
                            });

                            if (!res.ok) {
                                const errorData = await res.json();
                                throw new Error(errorData.message || `Lỗi khi hủy đơn hàng! trạng thái: ${res.status}`);
                            }

                            Toast.show({ type: 'success', text1: 'Hủy đơn hàng thành công', text2: `Đơn hàng ${orderId.slice(-6).toUpperCase()} đã được hủy.` });
                            // Sau khi hủy thành công, gọi lại hàm fetchOrders để cập nhật danh sách
                            // hoặc cập nhật trạng thái của order ngay lập tức trong state
                            setOrders(prevOrders => prevOrders.map(order =>
                                order._id === orderId ? { ...order, status: 'Cancelled' } : order
                            ));

                        } catch (error) {
                            console.error("Lỗi khi hủy đơn hàng:", error.message);
                            Toast.show({ type: 'error', text1: 'Hủy đơn hàng thất bại', text2: error.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.' });
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };
    // HẾT HÀM HỦY ĐƠN HÀNG MỚI

    useFocusEffect(
        useCallback(() => {
            fetchUserAndOrders();
        }, [fetchUserAndOrders])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserAndOrders();
    }, [fetchUserAndOrders]);

    const formatOrderDate = (dateString) => {
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
            default:
                text = status;
        }
        return { style, text };
    };

    const renderOrderItem = ({ item }) => {
        const { style: statusStyle, text: statusText } = getStatusDisplay(item.status);
        // Kiểm tra xem đơn hàng có thể hủy được không
        const canCancel = item.status === 'Pending'; // Chỉ hủy khi trạng thái là Pending

        return (
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetails', { order: item })}
            >
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Mã đơn hàng: #{item._id.slice(-6).toUpperCase()}</Text>
                    <Text style={[styles.orderStatus, statusStyle]}>
                        {statusText}
                    </Text>
                </View>
                <View style={styles.orderDetails}>
                    {item.items.slice(0, 2).map((productItem, index) => (
                        <View key={index} style={styles.productRow}>
                            {productItem.product_image && (
                                <Image
                                    source={{ uri: `${linkanh}${productItem.product_image}` }}
                                    style={styles.productImage}
                                />
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{productItem.product_name}</Text>
                                <Text style={styles.productQuantity}>SL: {productItem.quantity}</Text>
                            </View>
                            <Text style={styles.productPrice}>${(productItem.price * productItem.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    {item.items.length > 2 && (
                        <Text style={styles.moreItemsText}>Và {item.items.length - 2} sản phẩm khác...</Text>
                    )}
                </View>
                <View style={styles.orderFooter}>
                    <Text style={styles.totalAmountLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalAmountValue}>${item.total_amount.toFixed(2)}</Text>
                </View>
                <Text style={styles.orderDate}>Ngày đặt: {formatOrderDate(item.createdAt)}</Text>

                {/* NÚT HỦY ĐƠN HÀNG */}
                {canCancel && ( // Chỉ hiển thị nút khi canCancel là true
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => cancelOrder(item._id)}
                    >
                        <Text style={styles.cancelButtonText}>Hủy Đơn Hàng</Text>
                    </TouchableOpacity>
                )}
                {/* HẾT NÚT HỦY ĐƠN HÀNG */}
            </TouchableOpacity>
        );
    };

    if (loading && orders.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f55" />
                <Text style={{ marginTop: 10, color: '#333' }}>Đang tải lịch sử đơn hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
            </View>

            {orders.length === 0 && !loading && (
                <View style={styles.emptyContainer}>
                    <Feather name="box" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào!</Text>
                    <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
                contentContainerStyle={orders.length > 0 ? styles.listContentContainer : styles.emptyListContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f55']} />
                }
            />
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    shopNowButton: {
        backgroundColor: '#f55',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 30,
    },
    shopNowButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderCard: {
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
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        overflow: 'hidden',
    },
    statusPending: {
        backgroundColor: '#ffedd5',
        color: '#f97316',
    },
    statusProcessing: {
        backgroundColor: '#bfdbfe',
        color: '#2563eb',
    },
    statusDelivered: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
    },
    statusCancelled: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
    },
    statusDefault: {
        backgroundColor: '#e5e7eb',
        color: '#4b5563',
    },
    orderDetails: {
        marginBottom: 10,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#eee',
        resizeMode: 'cover',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    productQuantity: {
        fontSize: 13,
        color: '#777',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#f55',
    },
    moreItemsText: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 5,
        textAlign: 'right',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalAmountLabel: {
        fontSize: 16,
        color: '#555',
    },
    totalAmountValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f55',
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        textAlign: 'right',
    },
    // STYLE MỚI CHO NÚT HỦY ĐƠN HÀNG
    cancelButton: {
        backgroundColor: '#dc2626', // Màu đỏ cho nút hủy
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});