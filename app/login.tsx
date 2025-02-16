import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ApiService from './services/apiService';
import Util from './util/utils';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Registration: undefined;
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (): Promise<void> => {

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {

      const response = await ApiService.post<any>('/login', {
        username: email,
        password: password
      });

      Util.removeData('customerId');
      Util.removeData('businessId');

      if (response.role === 'customer') {
        Util.storeData('customerId', response.customerid);
        console.log('Customer ID saved to localStorage:', response.customerid);
      } else if (response.role === 'business') {
        Util.storeData('businessId', response.branch.businessid);
        console.log('Business ID saved to localStorage:', response.branch.businessid);
      }

      Util.storeData('username', response.username);
      Util.storeData('userid', response.userid);
      Util.storeData('userRole', response.role);
      Util.storeData('userBranch', response.branch.name);

      Alert.alert('Success', 'Login Successful!', [
        {
          text: 'OK',
          onPress: () => {
            // Add a small delay for debugging
            setTimeout(() => {
              navigation.navigate('Dashboard');
            }, 500); // Small timeout to simulate the alert dismissal and then navigate
          }
        }
      ]);
    } catch (error: any) {
      console.log('Login failed. ', error);
      Alert.alert('Failure', ''+error.error);
    }

  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#a9a9a9"
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a9a9a9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registration')}
        >
          <Text style={styles.buttonText}>Go to Registration</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#4070f4",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#5D3FD3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'underline',
  }
});
