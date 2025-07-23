// src/screens/OrderHistoryScreen.js
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockOrders = [
  {
    id: 'order1',
    date: '09/11/2024 02:30',
    status: 'processing',
    items: [
      { name: 'Pepperoni Lovers', price: 12.99, quantity: 2, img: require('../assets/pizza.png') },
      { name: 'Mint Lemonade', price: 3.99, quantity: 4, img: require('../assets/lemonade.png') },
    ],
    total: 41.94,
  },
];

export default function OrderHistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đơn hàng của tôi</Text>
      <FlatList
        data={mockOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail')} />}
      />
    </View>
  );
}

function OrderCard({ order, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.date}>{order.date}</Text>
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Image source={item.img} style={styles.image} />
            <View>
              <Text>{item.name}</Text>
              <Text>${item.price.toFixed(2)} x{item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.total}>Tổng thanh toán: ${order.total.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fefefe',
  },
  date: { fontWeight: 'bold', marginBottom: 8 },
  itemsContainer: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  image: { width: 50, height: 50, borderRadius: 6 },
  total: { fontWeight: 'bold', color: '#000' },
});
