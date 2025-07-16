import { linkapi } from '@/app/navigation/config';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Thêm MaterialCommunityIcons cho các icon khác
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit'; // Import LineChart

const screenWidth = Dimensions.get('window').width;
const BASE_SERVER_URL = linkapi;

export default function AdminDashboardScreen({ route }) {
    const navigation = useNavigation();
    const [restaurantId, setRestaurantId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [orderStats, setOrderStats] = useState({ completed: 0, pendingAndProcessing: 0, cancelled: 0 });

    // State mới để lưu trữ dữ liệu cho biểu đồ doanh thu theo ngày
    const [revenueByDate, setRevenueByDate] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);


    const fetchDashboardData = useCallback(async (id, isRefreshing = false) => {
        if (!id) {
            setError('Không tìm thấy ID nhà hàng.');
            setLoading(false);
            setRefreshing(false);
            return;
        }

        if (!isRefreshing) setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_SERVER_URL}admin/dashboard-stats/by-restaurant/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Lỗi khi lấy dữ liệu dashboard từ server.');
            }

            console.log('📊 Dữ liệu Dashboard từ Backend:', data);

            setTotalOrders(data.totalOrders);
            setTotalRevenue(data.totalRevenue);
            setOrderStats(data.orderStats);
            setTotalProducts(data.totalProducts);
            setTotalReviews(data.totalReviews);

            // Cập nhật state cho dữ liệu biểu đồ và đơn hàng gần đây
            setRevenueByDate(data.revenueByDate || {});
            setRecentOrders(data.recentOrders || []);

        } catch (err) {
            console.error('Lỗi khi fetch dữ liệu dashboard:', err);
            setError(err.message || 'Không thể tải dữ liệu dashboard.');
        } finally {
            if (!isRefreshing) setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const getRestaurantIdAndFetch = async () => {
                const id = await AsyncStorage.getItem('restaurant_id');
                if (id) {
                    setRestaurantId(id);
                    fetchDashboardData(id);
                } else {
                    setLoading(false);
                    setError('Không tìm thấy ID nhà hàng. Vui lòng đăng nhập lại.');
                }
            };
            getRestaurantIdAndFetch();
            return () => {
                console.log('AdminDashboardScreen unfocused.');
            };
        }, [fetchDashboardData])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (restaurantId) {
            fetchDashboardData(restaurantId, true);
        } else {
            setRefreshing(false);
        }
    }, [fetchDashboardData, restaurantId]);

    // Dữ liệu cho PieChart
    const pieData = [
        { name: 'Hoàn thành', population: orderStats.completed > 0 ? orderStats.completed : 0, color: '#4CAF50', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Chờ xử lý', population: orderStats.pendingAndProcessing > 0 ? orderStats.pendingAndProcessing : 0, color: '#FFB300', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Đã hủy', population: orderStats.cancelled > 0 ? orderStats.cancelled : 0, color: '#F44336', legendFontColor: '#000', legendFontSize: 12 },
    ];

    // Dữ liệu cho LineChart (Doanh thu theo ngày)
    const dates = Object.keys(revenueByDate).sort();
    const revenueValues = dates.map(d => revenueByDate[d]);

    const lineChartData = {
        labels: dates.length > 0 ? dates.map(date => date.substring(5)) : ['No Data'],
        datasets: [{ data: revenueValues.length > 0 ? revenueValues : [0] }],
    };

    const lineChartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(14, 17, 22, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(68, 68, 68, ${opacity})`,
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#2196F3'
        },
        propsForLabels: {
            fontSize: 10,
        },
        fillShadowGradient: '#2196F3',
        fillShadowGradientOpacity: 0.1,
    };


    if (loading && !refreshing) {
        return (
            <View style={styles.centeredView}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Đang tải dữ liệu dashboard...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredView}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => {
                    if (restaurantId) fetchDashboardData(restaurantId);
                    else navigation.goBack();
                }}>
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0000ff']} />
            }
        >

            {/* Hàng 1: Tổng đơn hàng & Doanh thu */}
            <View style={styles.summaryRow}>
                <View style={[styles.card, { borderLeftColor: '#2196F3' }]}>
                    <AntDesign name="shoppingcart" size={24} color="#2196F3" />
                    <Text style={styles.cardNumber}>{totalOrders}</Text>
                    <Text style={styles.cardLabel}>Tổng đơn hàng</Text>
                </View>
                <View style={[styles.card, { borderLeftColor: '#4CAF50' }]}>
                    <AntDesign name="linechart" size={24} color="#4CAF50" />
                    <Text style={styles.cardNumber}>{totalRevenue.toLocaleString()} $</Text>
                    <Text style={styles.cardLabel}>Doanh thu</Text>
                </View>
            </View>

            {/* Hàng 2: Tổng món ăn & Tổng đánh giá */}
            <View style={styles.summaryRow}>
                <View style={[styles.card, { borderLeftColor: '#FFC107' }]}>
                    <MaterialCommunityIcons name="food" size={24} color="#FFC107" />
                    <Text style={styles.cardNumber}>{totalProducts}</Text>
                    <Text style={styles.cardLabel}>Tổng món ăn</Text>
                </View>
                <View style={[styles.card, { borderLeftColor: '#9C27B0' }]}>
                    <AntDesign name="staro" size={24} color="#9C27B0" />
                    <Text style={styles.cardNumber}>{totalReviews}</Text>
                    <Text style={styles.cardLabel}>Tổng đánh giá</Text>
                </View>
            </View> 

            <Text style={styles.sectionTitle}>Thống kê đơn hàng</Text>
            {/* Thống kê chi tiết đơn hàng (các hộp màu) */}
            <View style={styles.statusRow}>
                <View style={[styles.statusBox, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.statusNumber}>{orderStats.completed}</Text>
                    <Text style={styles.statusLabel}>Hoàn thành</Text>
                </View>
                <View style={[styles.statusBox, { backgroundColor: '#FFB300' }]}>
                    <Text style={styles.statusNumber}>{orderStats.pendingAndProcessing}</Text>
                    <Text style={styles.statusLabel}>Chờ xử lý</Text>
                </View>
                <View style={[styles.statusBox, { backgroundColor: '#F44336' }]}>
                    <Text style={styles.statusNumber}>{orderStats.cancelled}</Text>
                    <Text style={styles.statusLabel}>Đã hủy</Text>
                </View>
            </View>

            {/* Biểu đồ PieChart */}
            {(orderStats.completed + orderStats.pendingAndProcessing + orderStats.cancelled) > 0 ? (
                <PieChart
                    data={pieData}
                    width={screenWidth - 30}
                    height={200}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[0, 0]}
                    absolute
                    style={styles.chartStyle}
                />
            ) : (
                <Text style={styles.noDataText}>Không có dữ liệu đơn hàng để hiển thị biểu đồ trạng thái.</Text>
            )}

            {/* === PHẦN THÊM MỚI: BIỂU ĐỒ DOANH THU 7 NGÀY === */}
            <Text style={styles.sectionTitle}>Doanh thu 7 ngày gần đây</Text>
            {dates.length > 0 && revenueValues.some(val => val > 0) ? (
                <LineChart
                    data={lineChartData}
                    width={screenWidth - 30}
                    height={220}
                    chartConfig={lineChartConfig}
                    bezier
                    fromZero
                    style={styles.chartStyle}
                    // Thêm scrollableDot
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    segments={dates.length > 7 ? 4 : dates.length}
                />
            ) : (
                <Text style={styles.noDataText}>Không có dữ liệu doanh thu trong 7 ngày gần đây.</Text>
            )}

            {/* === ĐƠN HÀNG GẦN ĐÂY (Vẫn giữ lại) === */}
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
            {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                    <View key={order._id || index} style={styles.orderRow}>
                        <View style={styles.orderLeft}>
                            <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
                            <Text style={styles.orderDate}>{new Date(order.order_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                        <View style={styles.orderRight}>
                            <Text style={styles.orderAmount}>{Math.round(order.total_amount).toLocaleString()} $</Text>
                            <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                                {getStatusText(order.status)}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>Không có đơn hàng gần đây.</Text>
            )}

            <View style={{ height: 50 }} />
        </ScrollView>
    );
}

// Hàm hỗ trợ để lấy màu sắc trạng thái
const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return '#4CAF50';
        case 'Rated': return '#2196F3';
        case 'Pending': return '#FFB300';
        case 'Processing': return '#FFC107';
        case 'Cancelled': return '#F44336';
        default: return '#666';
    }
};

// Hàm hỗ trợ để lấy text trạng thái
const getStatusText = (status) => {
    switch (status) {
        case 'Delivered': return 'Đã giao';
        case 'Rated': return 'Đã giao & Đánh giá';
        case 'Pending': return 'Đang chờ';
        case 'Processing': return 'Đang xử lý';
        case 'Cancelled': return 'Đã hủy';
        default: return status;
    }
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
    mainTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    card: {
        flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 18,
        marginHorizontal: 5, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
        borderLeftWidth: 5,
    },
    cardNumber: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 8, marginBottom: 4 },
    cardLabel: { color: '#666', fontSize: 13, textAlign: 'center' },

    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },

    statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statusBox: {
        flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 3, elevation: 2
    },
    statusNumber: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    statusLabel: { color: '#fff', fontSize: 13, marginTop: 5 },

    chartStyle: {
        marginVertical: 15,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
        paddingRight: 40, // Tăng khoảng trống bên phải để labels không bị cắt
    },

    // Styles cho Recent Orders (giữ nguyên hoặc điều chỉnh nhẹ)
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 2, elevation: 2,
    },
    orderLeft: { flexDirection: 'column' },
    orderRight: { alignItems: 'flex-end' },
    orderId: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    orderDate: { fontSize: 12, color: '#888', marginTop: 2 },
    orderAmount: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
    orderStatus: { fontSize: 13, fontWeight: '500', marginTop: 2 },

    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
    errorText: { color: 'red', textAlign: 'center', fontSize: 16, marginBottom: 20 },
    retryButton: { backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    retryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    noDataText: { textAlign: 'center', color: '#888', marginTop: 30, fontSize: 15, fontStyle: 'italic', marginBottom: 20 }
});