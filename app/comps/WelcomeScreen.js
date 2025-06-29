import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Banner.png')} // ảnh bạn đặt ở assets/intro.png
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome To EatUp</Text>

      <Text style={styles.subtitle}>
        Order with ease, savor the flavors your favorite food, just a tap away
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFD5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D94F4F',
    marginTop: 30,
  },
  subtitle: {
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 22,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#F76C6C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
