import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboardScreen() {
    const navigation = useNavigation();
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [orderStats, setOrderStats] = useState({ completed: 0, pending: 0, cancelled: 0 });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            // Fake data, sau này bạn thay bằng API thật
            setTotalOrders(7);
            setTotalUsers(7);
            setTotalProducts(7);
            setTotalReviews(7);
            setOrderStats({ completed: 2, pending: 4, cancelled: 1 });
        } catch (error) {
            console.error(error);
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
                    <Text style={styles.cardNumber}>{totalUsers}</Text>
                    <Text style={styles.cardLabel}>Tổng người dùng</Text>
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
