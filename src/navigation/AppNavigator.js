import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressListScreen from '../screens/AddressListScreen';
import EditAddressScreen from '../screens/EditAddressScreen';
import EditNameScreen from '../screens/EditNameScreen';
import EditPasswordScreen from '../screens/EditPasswordScreen';
import EditPhoneScreen from '../screens/EditPhoneScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VerifyAccountScreen from '../screens/VerifyAccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
      <Stack.Screen name="EditName" component={EditNameScreen} options={{ title: 'Tên' }} />
      <Stack.Screen name="EditPhone" component={EditPhoneScreen} options={{ title: 'Số điện thoại' }} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} options={{ title: 'Xác minh tài khoản' }} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} options={{ title: 'Mật khẩu' }} />
      <Stack.Screen name="AddressList" component={AddressListScreen} options={{ title: 'Địa chỉ nhận hàng' }} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} options={{ title: 'Thay đổi địa chỉ' }} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ title: 'Thêm địa chỉ' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Favorites') iconName = 'heart-outline';
          else if (route.name === 'Contact') iconName = 'call-outline';
          else if (route.name === 'Me') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}>
      <Tab.Screen name="Home" component={DummyScreen} />
      <Tab.Screen name="Favorites" component={DummyScreen} />
      <Tab.Screen name="Contact" component={DummyScreen} />
      <Tab.Screen name="Me" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function DummyScreen() {
  return null;
}
