import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import Home from './home';
import Registration from './registration';
import GasOrder from './gazOrder';
import Dashboard from './dashboard';
import MyOrders from './myOrders';

// Define the types for your routes
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Registration: undefined;
  GasOrder: undefined;
  Dashboard: undefined;
  MyOrders: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}  // Hide the header for all screens
    >
      <Stack.Screen
        name="Login"
        component={Login}  // Directly use the component without type casting
        options={{ title: 'Login Screen' }}  // Title will be shown if header is visible
      />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="GasOrder" component={GasOrder} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
    </Stack.Navigator>
  );
}
