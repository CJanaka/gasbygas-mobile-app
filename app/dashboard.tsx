import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Home, ShoppingCart, List } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Dashboard: undefined;
    GasOrder: undefined;
    MyOrders: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
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
                <ShoppingCart style={{ alignSelf: 'center', marginBottom: 8 }} size={48} />
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
                <List style={{ alignSelf: 'center', marginBottom: 8 }} size={48} />
                <Text style={{ textAlign: 'center' }}>View Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'place-order':
        return (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Place Order</Text>
            <TextInput 
              placeholder="Product Name" 
              style={{ 
                borderWidth: 1, 
                borderColor: '#e5e7eb', 
                padding: 8, 
                marginBottom: 16, 
                borderRadius: 8 
              }}
            />
            <TextInput 
              placeholder="Quantity" 
              keyboardType="numeric"
              style={{ 
                borderWidth: 1, 
                borderColor: '#e5e7eb', 
                padding: 8, 
                marginBottom: 16, 
                borderRadius: 8 
              }}
            />
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#3b82f6', 
                padding: 12, 
                borderRadius: 8 
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Submit Order</Text>
            </TouchableOpacity>
          </View>
        );
      case 'my-orders':
        return (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Orders</Text>
            <View style={{ gap: 8 }}>
              <View style={{ 
                backgroundColor: '#f3f4f6', 
                padding: 12, 
                borderRadius: 8,
                flexDirection: 'row', 
                justifyContent: 'space-between' 
              }}>
                <Text>Order #1234</Text>
                <Text>Status: Shipped</Text>
              </View>
              <View style={{ 
                backgroundColor: '#f3f4f6', 
                padding: 12, 
                borderRadius: 8,
                flexDirection: 'row', 
                justifyContent: 'space-between' 
              }}>
                <Text>Order #5678</Text>
                <Text>Status: Processing</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {renderContent()}
      </ScrollView>
      
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