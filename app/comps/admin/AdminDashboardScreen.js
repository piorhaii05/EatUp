import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const BASE_SERVER_URL = 'http://172.16.0.2:3000';

export default function AdminDashboardScreen({ route }) {
    const navigation = useNavigation();
    const [restaurantId, setRestaurantId] = useState(null);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [orderStats, setOrderStats] = useState({ completed: 0, pending: 0, cancelled: 0 });

    useEffect(() => {
        const getRestaurantId = async () => {
            const id = await AsyncStorage.getItem('restaurant_id');
            // console.log('📦 ID từ AsyncStorage:', id);
            if (id) setRestaurantId(id);
        };
        getRestaurantId();
    }, []);

    useEffect(() => {
        if (restaurantId) {
            fetchStatistics(restaurantId);
        }
    }, [restaurantId]);

    const fetchStatistics = async (restaurantId) => {
        try {
            const res = await fetch(`${BASE_SERVER_URL}/api/admin/orders/by-restaurant/${restaurantId}`);
            const orders = await res.json();

            const resProducts = await fetch(`${BASE_SERVER_URL}/api/product/by-restaurant/${restaurantId}`);
            const products = await resProducts.json();

            // Fetch đánh giá của nhà hàng
            const resReviewsRestaurant = await fetch(`${BASE_SERVER_URL}/api/reviews/Restaurant/${restaurantId}`);
            const restaurantReviews = await resReviewsRestaurant.json();

            // Fetch đánh giá của từng sản phẩm
            let productReviewCount = 0;
            for (const product of products) {
                const resProductReview = await fetch(`${BASE_SERVER_URL}/api/reviews/Product/${product._id}`);
                const productReviews = await resProductReview.json();
                if (Array.isArray(productReviews)) {
                    productReviewCount += productReviews.length;
                }
            }

            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

            const stats = { completed: 0, pending: 0, cancelled: 0 };

            orders.forEach(order => {
                const status = order.status?.toLowerCase();
                if (status === 'rated' || status === 'completed') stats.completed++;
                else if (status === 'pending') stats.pending++;
                else if (status === 'cancelled') stats.cancelled++;
            });

            setTotalOrders(totalOrders);
            setTotalRevenue(totalRevenue);
            setOrderStats(stats);

            setTotalProducts(Array.isArray(products) ? products.length : 0);
            const totalReviewCount = (Array.isArray(restaurantReviews) ? restaurantReviews.length : 0) + productReviewCount;
            setTotalReviews(totalReviewCount);

        } catch (error) {
            console.error('Lỗi fetch:', error);
        }
    };

    const pieData = [
        { name: 'Hoàn thành', population: orderStats.completed, color: '#f55', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Chờ xác nhận', population: orderStats.pending, color: '#FFB300', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Đã hủy', population: orderStats.cancelled, color: '#aaa', legendFontColor: '#000', legendFontSize: 12 },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.summaryRow}>
                <View style={styles.card}>
                    <Text style={styles.cardNumber}>{totalOrders}</Text>
                    <Text style={styles.cardLabel}>Tổng đơn hàng</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardNumber}>{totalRevenue.toLocaleString()} $</Text>
                    <Text style={styles.cardLabel}>Doanh thu</Text>
                </View>
            </View>

            <View style={styles.summaryRow}>
                <View style={styles.card}>
                    <Text style={styles.cardNumber}>{totalProducts}</Text>
                    <Text style={styles.cardLabel}>Tổng món ăn</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardNumber}>{totalReviews}</Text>
                    <Text style={styles.cardLabel}>Tổng đánh giá</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Thống kê đơn hàng</Text>

            <View style={styles.statusRow}>
                <View style={[styles.statusBox, { backgroundColor: '#f55' }]}>
                    <Text style={styles.statusNumber}>{orderStats.completed}</Text>
                    <Text style={styles.statusLabel}>Hoàn thành</Text>
                </View>
                <View style={[styles.statusBox, { backgroundColor: '#FFD700' }]}>
                    <Text style={styles.statusNumber}>{orderStats.pending}</Text>
                    <Text style={styles.statusLabel}>Chờ xác nhận</Text>
                </View>
                <View style={[styles.statusBox, { backgroundColor: '#aaa' }]}>
                    <Text style={styles.statusNumber}>{orderStats.cancelled}</Text>
                    <Text style={styles.statusLabel}>Đã hủy</Text>
                </View>
            </View>

            <PieChart
                data={pieData}
                width={screenWidth - 30}
                height={200}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: () => '#000',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]}
                absolute
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 15 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    card: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginHorizontal: 5, alignItems: 'center' },
    cardNumber: { fontSize: 22, fontWeight: 'bold', color: '#f55', marginBottom: 5 },
    cardLabel: { color: '#333', fontSize: 14, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statusBox: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    statusNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    statusLabel: { color: '#fff', fontSize: 14, marginTop: 5 },
});
