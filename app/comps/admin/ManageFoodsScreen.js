import { Entypo, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../../navigation/config';

export default function ManageFoodsScreen({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRestaurantId(user._id);
      try {
        const res = await fetch(`${linkapi}product/by-restaurant/${user._id}`);
        const data = await res.json();
        setFoods(data);
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Lỗi tải danh sách món ăn' });
      }
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa món ăn này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await fetch(`${linkapi}product/${id}`, { method: 'DELETE' });
            setFoods(foods.filter(item => item._id !== id));
            Toast.show({ type: 'success', text1: 'Đã xóa món ăn' });
          } catch (err) {
            Toast.show({ type: 'error', text1: 'Lỗi xóa món ăn' });
          }
        }
      }
    ]);
  };

  const filteredFoods = foods.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: linkanh + item.image_url }}
        style={styles.itemImage}
        resizeMode='cover'
      />
      {/* Thay đổi ở đây: Thêm numberOfLines và ellipsizeMode */}
      <Text
        style={styles.itemName}
        numberOfLines={1} // Giới hạn chỉ 1 dòng
        ellipsizeMode='tail' // Hiển thị "..." ở cuối nếu văn bản bị cắt
      >
        {item.name}
      </Text>
      <Text style={styles.itemPrice}>{item.price} $</Text>
      <Text style={styles.itemRating}>{item.rating} ⭐</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => navigation.navigate('EditFood', { food: item, restaurantId })}>
          <Feather name="edit" size={20} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Feather name="trash" size={20} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f55" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="#f55" />
        <TextInput
          placeholder="Tìm kiếm món ăn..."
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredFoods}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có món ăn nào</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AdminAddProduct', { restaurantId, reload: fetchFoods })}
      >
        <Entypo name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f55',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 15
  },
  input: {
    flex: 1,
    padding: 10
  },
  itemContainer: {
    backgroundColor: '#eee',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    width: '47%',
    alignItems: 'center'
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10
  },
  itemName: {
    fontWeight: 'bold',
    marginTop: 5,
    // Các thuộc tính mới được thêm vào
    width: '100%', // Đảm bảo Text chiếm đủ chiều rộng để áp dụng ellipsis
    textAlign: 'center' // Căn giữa tên món ăn
  },
  itemDesc: {
    color: '#777',
    marginBottom: 5
  },
  itemPrice: {
    color: '#f55',
    marginTop: 2
  },
  itemRating: {
    color: '#444',
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f55',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20
  }
});