import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { linkapi } from '../navigation/config';

export default function AddBankScreen({ navigation }) {
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleAddBank = async () => {
        if (!cardHolder || !cardNumber || !expiryDate) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString);

            await fetch(linkapi + 'bank/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user._id,
                    card_number: cardNumber,
                    card_holder: cardHolder,
                    expiry_date: expiryDate
                })
            });

            Toast.show({
                type: 'success',
                text1: 'Thêm tài khoản thành công!',
            });

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Thêm tài khoản thất bại');
        }
    };

    const formatCardNumber = (number) => {
        return number.replace(/\d{4}(?=.)/g, '$& ');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Thêm tài khoản ngân hàng</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <Image
                            source={require('../../assets/images/mastercard.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.expiry}>{expiryDate || 'MM/YY'}</Text>
                    </View>

                    <Text style={styles.cardNumber}>
                        {cardNumber ? formatCardNumber(cardNumber) : '**** **** **** ****'}
                    </Text>

                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.label}>Card Holder</Text>
                            <Text style={styles.value}>{cardHolder || 'Chưa cập nhật'}</Text>
                        </View>
                    </View>
                </View>

                <TextInput
                    placeholder="Họ và Tên"
                    style={styles.input}
                    value={cardHolder}
                    onChangeText={setCardHolder}
                />
                <TextInput
                    placeholder="Số tài khoản"
                    style={styles.input}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                />
                <View style={styles.row}>
                    <TextInput
                        placeholder="CVV"
                        style={[styles.input, { flex: 1, marginRight: 10 }]}
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={4}
                    />
                    <TextInput
                        placeholder="Ngày hết hạn (MM/YY)"
                        style={[styles.input, { flex: 1 }]}
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                    />
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleAddBank}>
                    <Text style={styles.saveText}>HOÀN THÀNH</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { padding: 5, marginRight: 10 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000' },

    card: {
        backgroundColor: '#222',
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
        elevation: 3,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: { width: 50, height: 30 },
    expiry: { color: '#fff', fontSize: 16 },
    cardNumber: {
        color: '#fff',
        fontSize: 20,
        letterSpacing: 2,
        marginVertical: 15,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: { color: '#aaa', fontSize: 12 },
    value: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    input: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 18,
        marginBottom: 20,
        fontSize: 16,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    saveBtn: {
        backgroundColor: '#f55',
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
