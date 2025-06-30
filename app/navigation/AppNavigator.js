import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../comps/LoginScreen';
import ProductDetail from '../comps/ProductDetail';
import RegisterScreen from '../comps/RegisterScreen';
import SplashScreen from '../comps/SplashScreen';
import WelcomeScreen from '../comps/WelcomeScreen';
import Bottombar from './Bottombar';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={Bottombar} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: 'Chi tiết sản phẩm' }} />
  </Stack.Navigator>
);

export default AppNavigator;
