import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface GasType {
  id: number;
  name: string;
  price: number;
}

const GAS_TYPES: GasType[] = [
  { id: 1, name: 'Regular Gas', price: 3.50 },
  { id: 2, name: 'Premium Gas', price: 4.20 },
  { id: 3, name: 'Diesel', price: 3.80 }
];

const GasOrder = () => {
  const [selectedTypes, setSelectedTypes] = useState<{[key: number]: number}>({});

  const updateQuantity = (typeId: number, change: number) => {
    setSelectedTypes(prev => {
      const currentQuantity = prev[typeId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      return newQuantity > 0 
        ? { ...prev, [typeId]: newQuantity }
        : Object.fromEntries(
            Object.entries(prev).filter(([id]) => parseInt(id) !== typeId)
          );
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedTypes).reduce((total, [typeId, quantity]) => {
      const gasType = GAS_TYPES.find(g => g.id === parseInt(typeId));
      return total + (gasType ? gasType.price * quantity : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedTypes).length === 0) {
      alert('Please select at least one gas type');
      return;
    }

    const orderData = {
      orderItems: Object.entries(selectedTypes).map(([typeId, quantity]) => ({
        gasTypeId: parseInt(typeId),
        quantity
      })),
      totalAmount: calculateTotal()
    };

    try {
      const response = await fetch('YOUR_GAS_ORDER_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Order Submitted Successfully');
      } else {
        alert('Order Submission Failed');
      }
    } catch (error) {
      console.error('Order Submission Error', error);
      alert('Network Error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gas Order Selection</Text>

      {GAS_TYPES.map((gasType) => (
        <View key={gasType.id} style={styles.gasTypeContainer}>
          <View style={styles.gasTypeInfo}>
            <Text style={styles.gasTypeName}>{gasType.name}</Text>
            <Text style={styles.gasTypePrice}>Price: ${gasType.price.toFixed(2)} per unit</Text>
          </View>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(gasType.id, -1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>
              {selectedTypes[gasType.id] || 0}
            </Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(gasType.id, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Amount: ${calculateTotal().toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  gasTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  gasTypeInfo: {
    flex: 1
  },
  gasTypeName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  gasTypePrice: {
    fontSize: 14,
    color: '#666'
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 18
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default GasOrder;