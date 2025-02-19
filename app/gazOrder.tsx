import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import ApiService from './services/apiService';
import Util from './util/utils';

interface GasType {
  id: number;
  name: string;
  price: number;
  sizeCategory: 'small' | 'medium' | 'large' | 'extraLarge';
}

const GAS_TYPES: GasType[] = [
  { id: 1, name: '2.5KG Gas', price: 500.00, sizeCategory: 'small' },
  { id: 2, name: '5KG Gas', price: 1000.00, sizeCategory: 'medium' },
  { id: 3, name: '12KG Gas', price: 2500.00, sizeCategory: 'large' }
];

const GasOrder = () => {
  const [selectedTypes, setSelectedTypes] = useState<{ [key: number]: number }>({});
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [showEmptyTankModal, setShowEmptyTankModal] = useState(false);
  const [emptyTanks, setEmptyTanks] = useState<{ [key: string]: number }>({
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0
  });

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

  // Get max allowed empty tanks for a size category
  const getMaxEmptyTanks = (sizeCategory: string): number => {
    return Object.entries(selectedTypes).reduce((total, [typeId, quantity]) => {
      const gasType = GAS_TYPES.find(g => g.id === parseInt(typeId));
      if (gasType && gasType.sizeCategory === sizeCategory) {
        return total + quantity;
      }
      return total;
    }, 0);
  };

  const updateEmptyTankCount = (sizeCategory: string, change: number) => {
    const maxAllowed = getMaxEmptyTanks(sizeCategory);
    setEmptyTanks(prev => {
      const currentCount = prev[sizeCategory] || 0;
      const newCount = currentCount + change;
      
      // Ensure count stays between 0 and maxAllowed
      const validatedCount = Math.max(0, Math.min(newCount, maxAllowed));
      
      return {
        ...prev,
        [sizeCategory]: validatedCount
      };
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
    // Show empty tank modal first
    setShowEmptyTankModal(true);
  };

  const handleFinalSubmit = async () => {
    const userRole = await Util.getData('userRole');
    const userId = await Util.getData('userid');

    // Convert selected types to API format
    const orderTanks = {
      small: 0,
      medium: 0,
      large: 0,
      extraLarge: 0
    };

    Object.entries(selectedTypes).forEach(([typeId, quantity]) => {
      const gasType = GAS_TYPES.find(g => g.id === parseInt(typeId));
      if (gasType) {
        orderTanks[gasType.sizeCategory] = quantity;
      }
    });

    const orderData = {
      orderQuantities: orderTanks,
      tankQuantities: emptyTanks,
      orderDate: new Date().toISOString().split('T')[0],
      userRole,
      userId,
      customerId: userRole === 'customer' ? await Util.getData('customerId') : null,
      businessId: userRole === 'business' ? await Util.getData('businessId') : null,
      name: await Util.getData('username'),
      contact,
      email
    };

    // console.log(JSON.stringify(orderData))
    try {
      const response = await ApiService.post<any>('/create-order', orderData);

      const result = await response.json();

      console.log(result);
      Alert.alert('Success', 'Order Submitted Successfully');
      setShowEmptyTankModal(false);

      // Reset form
      setSelectedTypes({});
      setEmptyTanks({ small: 0, medium: 0, large: 0, extraLarge: 0 });
      setContact('');
      setEmail('');
    } catch (error:any) {
      console.error('Order Submission Error', error);
      Alert.alert('Failure', 'Order Submission Error: '+error.error);
    }
  };

  const handleSkipEmptyTanks = () => {
    setShowEmptyTankModal(false);
    handleFinalSubmit();
  };

  // For rendering selected gas types in the empty tank modal
  const renderSelectedGasTypes = () => {
    return Object.entries(selectedTypes).map(([typeId, quantity]) => {
      const gasType = GAS_TYPES.find(g => g.id === parseInt(typeId));
      if (!gasType || quantity === 0) return null;
      
      return (
        <View key={`selected-${gasType.id}`} style={styles.selectedGasItem}>
          <Text style={styles.selectedGasName}>{gasType.name}</Text>
          <Text style={styles.selectedGasQuantity}>Quantity: {quantity}</Text>
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gas Order Selection</Text>

      {GAS_TYPES.map((gasType) => (
        <View key={gasType.id} style={styles.gasTypeContainer}>
          <View style={styles.gasTypeInfo}>
            <Text style={styles.gasTypeName}>{gasType.name}</Text>
            <Text style={styles.gasTypePrice}>Price: LKR {gasType.price.toFixed(2)} per unit</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Contact (optional)"
        value={contact}
        onChangeText={setContact}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
      />
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Amount: LKR {calculateTotal().toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>

      {/* Empty Tank Modal */}
      <Modal
        visible={showEmptyTankModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Empty Cylinder Details</Text>
            
            <View style={styles.selectedGasContainer}>
              <Text style={styles.sectionTitle}>Your Selected Gas Types:</Text>
              {renderSelectedGasTypes()}
            </View>
            
            <Text style={styles.sectionTitle}>Enter Empty Cylinder Count:</Text>
            <Text style={styles.helperText}>Note: Empty cylinder count cannot exceed ordered quantity</Text>
            
            {Object.entries(emptyTanks).map(([size, count]) => {
              // Only show size categories for which gas has been ordered
              const maxAllowed = getMaxEmptyTanks(size);
              if (maxAllowed === 0) return null;
              
              const sizeDisplay = {
                small: '2.5KG (Small)',
                medium: '5KG (Medium)',
                large: '12KG (Large)',
                extraLarge: 'Extra Large'
              }[size];
              
              return (
                <View key={`empty-${size}`} style={styles.gasTypeContainer}>
                  <View style={styles.gasTypeInfo}>
                    <Text style={styles.gasTypeName}>{sizeDisplay} Empty Cylinders</Text>
                    <Text style={styles.maxAllowedText}>Maximum: {maxAllowed}</Text>
                  </View>

                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateEmptyTankCount(size, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>
                      {count}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        count >= maxAllowed && styles.disabledButton
                      ]}
                      onPress={() => updateEmptyTankCount(size, 1)}
                      disabled={count >= maxAllowed}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.skipButton]}
                onPress={handleSkipEmptyTanks}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleFinalSubmit}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginVertical: 10 },
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
  maxAllowedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10
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
  disabledButton: {
    backgroundColor: '#cccccc',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '100%'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  selectedGasContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15
  },
  selectedGasItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10
  },
  selectedGasName: {
    fontSize: 16
  },
  selectedGasQuantity: {
    fontSize: 16,
    fontWeight: '500'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
  },
  skipButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default GasOrder;