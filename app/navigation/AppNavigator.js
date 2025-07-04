import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddAddressScreen from '../comps/AddAddressScreen';
import AddBankScreen from '../comps/AddBankScreen';
import AddressListScreen from '../comps/AddressListScreen';
import BankListScreen from '../comps/BankListScreen';
import CartScreen from '../comps/CartScreen';
import ChangePasswordScreen from '../comps/ChangePasswordScreen';
import CheckoutScreen from '../comps/CheckoutScreen';
import EditAddressScreen from '../comps/EditAddressScreen';
import EditNamePhoneScreen from '../comps/EditNamePhoneScreen';
import HistoryOrdersScreen from '../comps/HistoryOrdersScreen';
import LoginScreen from '../comps/LoginScreen';
import OrderDetailsScreen from '../comps/OrderDetailsScreen';
import ProductDetail from '../comps/ProductDetail';
import RegisterScreen from '../comps/RegisterScreen';
import SearchResultsScreen from '../comps/SearchResultsScreen';
import SplashScreen from '../comps/SplashScreen';
import VoucherListScreen from '../comps/VoucherListScreen';
import VoucherScreen from '../comps/VoucherScreen';
import WelcomeScreen from '../comps/WelcomeScreen';
import AdminAddProductScreen from '../comps/admin/AdminAddProductScreen';
import AdminDashboardScreen from '../comps/admin/AdminDashboardScreen';
import AdminAppNavigatorScreen from './AdminAppNavigator';
import Bottombar from './Bottombar';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={Bottombar} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="AddressList" component={AddressListScreen} />
    <Stack.Screen name="AddAddress" component={AddAddressScreen} />
    <Stack.Screen name="EditAddress" component={EditAddressScreen} />
    <Stack.Screen name="BankList" component={BankListScreen} />
    <Stack.Screen name="AddBank" component={AddBankScreen} />
    <Stack.Screen name="EditNamePhone" component={EditNamePhoneScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="HomeAdmin" component={AdminAppNavigatorScreen} />
    <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="HistoryOrders" component={HistoryOrdersScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="Voucher" component={VoucherScreen} />
    <Stack.Screen name="VoucherList" component={VoucherListScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Chi tiết sản phẩm' }} />
  </Stack.Navigator>
);

export default AppNavigator;
