import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
<<<<<<< HEAD

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
=======
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require('../../assets/images/Banner.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middle}>
        <Text style={styles.title}>Welcome To EatUp</Text>
        <Text style={styles.subtitle}>
          Order with ease, savor the flavors your{'\n'}favorite food, just a tap away
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
>>>>>>> my-backup
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFD5',
<<<<<<< HEAD
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
=======
    justifyContent: 'space-between',
  },
  top: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  middle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D94F4F',
    marginBottom: 10,
  },
  subtitle: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F76C6C',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: '100%',
>>>>>>> my-backup
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
<<<<<<< HEAD
=======
    textAlign: 'center',
    fontSize: 16,
>>>>>>> my-backup
  },
});
