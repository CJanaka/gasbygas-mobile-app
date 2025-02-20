import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Home, ShoppingCart, List } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GasOrder from '../app/gazOrder';
import MyOrders from '../app/myOrders';
type RootStackParamList = {
  Dashboard: undefined;
  GasOrder: undefined;
  MyOrders: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Welcome</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#dbeafe',
                  padding: 16,
                  borderRadius: 8,
                  width: '48%'
                }} onPress={() => navigation.navigate('GasOrder')}
              >
                <ShoppingCart size={48} color='#6b7280' style={{ alignSelf: 'center', marginBottom: 8 }} />
                <Text style={{ textAlign: 'center' }}>Place New Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#dcfce7',
                  padding: 16,
                  borderRadius: 8,
                  width: '48%'
                }} onPress={() => navigation.navigate('MyOrders')}
              >
                <List size={48} color='#6b7280' style={{ alignSelf: 'center', marginBottom: 8 }} />
                <Text style={{ textAlign: 'center' }}>View Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'place-order':

        return (
          <ScrollView style={{ flex: 1, padding: 16 }}>
            <GasOrder />
          </ScrollView>
        );
      case 'my-orders':
        return (
          <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <MyOrders />
          </SafeAreaView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {renderContent()}
      </SafeAreaView>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingVertical: 8
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          style={{ alignItems: 'center' }}
        >
          <Home size={24} color={activeTab === 'home' ? '#3b82f6' : '#6b7280'} />
          <Text style={{
            fontSize: 12,
            color: activeTab === 'home' ? '#3b82f6' : '#6b7280'
          }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('place-order')}
          style={{ alignItems: 'center' }}
        >
          <ShoppingCart size={24} color={activeTab === 'place-order' ? '#3b82f6' : '#6b7280'} />
          <Text style={{
            fontSize: 12,
            color: activeTab === 'place-order' ? '#3b82f6' : '#6b7280'
          }}>Place Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('my-orders')}
          style={{ alignItems: 'center' }}
        >
          <List size={24} color={activeTab === 'my-orders' ? '#3b82f6' : '#6b7280'} />
          <Text style={{
            fontSize: 12,
            color: activeTab === 'my-orders' ? '#3b82f6' : '#6b7280'
          }}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function navigateOrderList() {
  throw new Error('Function not implemented.');
}
