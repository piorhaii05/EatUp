import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../comps/SplashScreen';
import WelcomeScreen from '../comps/WelcomeScreen';
import LoginScreen from '../comps/LoginScreen';

import AdminLoginScreen from '../comps/AdminLoginScreen';
import BankAccountScreen from '../comps/BankAccountScreen';
import FoodFilter from '../comps/FoodFilter';
import ManageOrdersScreen from '../comps/ManageOrdersScreen';
import ManageRestaurantsScreen from '../comps/ManageRestaurantsScreen';
import OrderTrackingScreen from '../comps/OrderTrackingScreen';
import PromoNotificationScreen from '../comps/PromoNotificationScreen';
import RevenueStatisticsScreen from '../comps/RevenueStatisticsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
    <Stack.Screen name="BankAccount" component={BankAccountScreen} />
    <Stack.Screen name="FoodFilter" component={FoodFilter} />
    <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
    <Stack.Screen name="ManageRestaurants" component={ManageRestaurantsScreen} />
    <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    <Stack.Screen name="PromoNotification" component={PromoNotificationScreen} />
    <Stack.Screen name="RevenueStatistics" component={RevenueStatisticsScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
