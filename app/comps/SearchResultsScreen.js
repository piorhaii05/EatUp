import { Entypo, Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkanh, linkapi } from '../navigation/config'; // Đảm bảo đường dẫn đúng

export default function SearchResultsScreen({ navigation, route }) {
    const { searchTerm: initialSearchTerm } = route.params; // Lấy từ khóa tìm kiếm từ params
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Để xử lý add to cart

    // Fetch user info for add to cart
    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                setUser(JSON.parse(userString));
            }
        };
        fetchUser();
    }, []);

    // Hàm tìm kiếm sản phẩm
    const fetchSearchResults = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            // Sử dụng endpoint tìm kiếm sản phẩm. Bạn cần đảm bảo API của bạn hỗ trợ endpoint này
            // Ví dụ: /api/product/search?name=keyword
            const res = await fetch(`${linkapi}product/search?name=${encodeURIComponent(query)}`);
            const data = await res.json();
            const filtered = data.filter(item => item.status === true);
            setSearchResults(filtered);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tải kết quả tìm kiếm.',
            });
            setSearchResults([]); // Xóa kết quả nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    // Gọi hàm tìm kiếm khi màn hình được tải hoặc khi searchTerm thay đổi
    useEffect(() => {
        fetchSearchResults(searchTerm);
    }, [searchTerm]); // Re-run when searchTerm changes

    const addToCart = async (product) => {
        try {
            if (!user?._id) {
                Toast.show({
                    type: 'info',
                    text1: 'Thông báo',
                    text2: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
                });
                navigation.navigate('Login'); // Chuyển hướng đến màn hình đăng nhập
                return;
            }

            await fetch(linkapi + 'cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    product_id: product._id,
                    quantity: 1
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

    const renderProduct = ({ item }) => (
        <TouchableOpacity 
            style={styles.foodCard} 
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            <Image source={{ uri: linkanh + item.image_url }} style={styles.foodImage} />
            <View style={styles.infoContainer}>
                <View style={styles.rowBetween}>
                    <Text style={styles.foodName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={styles.foodPrice}>{item.price} $</Text>
                </View>
                <View style={styles.rowBetween}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>{item.rating}/5</Text>
                        <Entypo name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                        <Feather name="plus" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm món ăn..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={() => fetchSearchResults(searchTerm)} // Tìm kiếm khi nhấn Enter/Search
                />
                <TouchableOpacity onPress={() => fetchSearchResults(searchTerm)} style={styles.searchButton}>
                    <Feather name="search" size={24} color="#f55" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#f55" style={styles.loadingIndicator} />
            ) : searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item._id}
                    renderItem={renderProduct}
                    numColumns={2} // Hiển thị 2 cột sản phẩm
                    columnWrapperStyle={styles.rowWrapper} // Để căn chỉnh các cột
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>Không tìm thấy sản phẩm nào phù hợp.</Text>
                </View>
            )}
            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#f55',
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
    },
    searchButton: {
        marginLeft: 10,
        padding: 5,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    rowWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    // Styles for product card (copied from HomeScreen to ensure consistency)
    foodCard: {
        width: '48%', // Khoảng 2 sản phẩm trên một hàng với một ít khoảng cách
        borderRadius: 12,
        backgroundColor: '#eee',
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    foodImage: {
        width: '100%',
        height: 120, // Tăng chiều cao ảnh một chút
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    foodName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        marginRight: 5,
    },
    foodPrice: {
        color: '#f55',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        color: '#555',
    },
    addBtn: {
        backgroundColor: '#f55',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});