import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet,
    TouchableOpacity, Image
} from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User'); // Default role

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />

            <Text style={styles.title}>ĐĂNG NHẬP</Text>

            <View style={styles.inputBox}>
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputBox}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <View style={styles.roleRow}>
                <TouchableOpacity onPress={() => setRole('Admin')}>
                    <Text style={[styles.roleOption, role === 'Admin' && styles.selected]}>○ Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRole('User')}>
                    <Text style={[styles.roleOption, role === 'User' && styles.selected]}>○ User</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={() => console.log('Đăng nhập')}>
                <Text style={styles.loginText}>Đăng Nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Bạn chưa có tài khoản? <Text style={styles.link}>Đăng ký</Text>
            </Text>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 80, backgroundColor: '#fff' },
    logo: { width: 100, height: 100, marginBottom: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },

    inputBox: {
        borderWidth: 1, borderColor: '#f55', borderRadius: 10,
        paddingHorizontal: 15, marginVertical: 10, width: '80%'
    },
    input: { paddingVertical: 10 },

    roleRow: { flexDirection: 'row', marginTop: 10 },
    roleOption: { marginHorizontal: 20, fontSize: 16, color: '#444' },
    selected: { fontWeight: 'bold', color: '#f55' },

    loginBtn: {
        marginTop: 20, backgroundColor: '#f55',
        paddingVertical: 12, paddingHorizontal: 50, borderRadius: 25
    },
    loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    link: { marginTop: 10, color: '#f55', fontWeight: '500' },
    footerText: { marginTop: 30, color: '#444' },
});
