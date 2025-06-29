import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../comps/SplashScreen';
import WelcomeScreen from '../comps/WelcomeScreen';
import LoginScreen from '../comps/LoginScreen';
import RegisterScreen from '../comps/RegisterScreen';
import Bottombar from './Bottombar';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={Bottombar} />
  </Stack.Navigator>
);

export default AppNavigator;
