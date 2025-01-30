import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface OrderItem {
  gasTypeId: number;
  quantity: number;
}

interface Order {
  id: number;
  orderItems: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

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

const ORDER: Order[] = [
  { id: 1, orderItems: [{gasTypeId: 1, quantity: 5,}], totalAmount: 3.50 , createdAt: '1:27:2025'},
  { id: 1, orderItems: [{gasTypeId: 2, quantity: 5,}], totalAmount: 3.50 , createdAt: '1/27/2025'},
  { id: 1, orderItems: [{gasTypeId: 3, quantity: 5,}], totalAmount: 3.50 , createdAt: '1/27/2025'},
];

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setOrders(ORDER);

    try {
      const response = await fetch('YOUR_ORDER_LIST_API_ENDPOINT');
      const data = await response.json();
      //set after API integration
      setOrders(ORDER);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalVisible(true);
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <TouchableOpacity 
        style={styles.orderContainer} 
        onPress={() => openOrderDetails(item)}
      >
        <Text style={styles.orderIdText}>Order #{item.id}</Text>
        <Text>Total Amount: ${item.totalAmount.toFixed(2)}</Text>
        <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </TouchableOpacity>
    );
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        visible={isDetailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <Text>Order ID: #{selectedOrder.id}</Text>
            <Text>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</Text>
            
            <Text style={styles.detailsSubtitle}>Order Items:</Text>
            {selectedOrder.orderItems.map((item) => {
              const gasType = GAS_TYPES.find(g => g.id === item.gasTypeId);
              return (
                <View key={item.gasTypeId} style={styles.orderItemDetails}>
                  <Text>{gasType?.name || 'Unknown Gas Type'}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Price: ${gasType ? (gasType.price * item.quantity).toFixed(2) : '0.00'}</Text>
                </View>
              );
            })}

            <Text style={styles.totalAmountText}>
              Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
            </Text>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsDetailModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No orders found</Text>
        }
      />
      {renderOrderDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  orderContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  },
  orderIdText: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  detailsSubtitle: {
    fontWeight: 'bold',
    marginTop: 10
  },
  orderItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  totalAmountText: {
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 15
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20
  }
});

export default MyOrders;