import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface OrderItem {
  gasTypeId: number;
  quantity: number;
}

interface Order {
  id: number;
  orderItems: OrderItem[];
  totalAmount: number;
  createdAt: String;
}

interface GasType {
  id: number;
  name: string;
  price: number;
}

const GAS_TYPES: GasType[] = [
  { id: 1, name: '2.5KG Gas', price: 1500.00 },
  { id: 2, name: '5KG Gas', price: 2300.00 },
  { id: 3, name: '12KG Gas', price: 3500.00 }
];

const ORDER: Order[] = [
  { id: 1, orderItems: [{gasTypeId: 1, quantity: 5,}], totalAmount: 15.00 , createdAt: '1:27:2025'},
  { id: 5, orderItems: [{gasTypeId: 2, quantity: 5,}], totalAmount: 20.00 , createdAt: '1/27/2025'},
  { id: 7, orderItems: [{gasTypeId: 3, quantity: 5,}], totalAmount: 25.00 , createdAt: '1/27/2025'},
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
      const response = await fetch('http://10.0.2.2:5001/customer-orders/1');
      const data = await response.json();
      //set after API integration
      console.error('Failed to fetch orders', data);

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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }}
      onPress={() => openOrderDetails(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: '600',
          marginBottom: 4 
        }}>
          Order - {item.id}
        </Text>
        <Text style={{ 
          color: '#374151',
          marginBottom: 2 
        }}>
          Total Amount: LKR {item.totalAmount.toFixed(2)}
        </Text>
        <Text style={{ color: '#6b7280' }}>
          Date: {item.createdAt}
        </Text>
      </View>
      <ChevronRight 
        size={24} 
        color="#9ca3af"
      />
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
            <Text>Order ID: - {selectedOrder.id}</Text>
            <Text>Date: {selectedOrder.createdAt}</Text>
            
            <Text style={styles.detailsSubtitle}>Order Items:</Text>
            {selectedOrder.orderItems.map((item) => {
              const gasType = GAS_TYPES.find(g => g.id === item.gasTypeId);
              return (
                <View key={item.gasTypeId} style={styles.orderItemDetails}>
                  <Text>{gasType?.name || 'Unknown Gas Type'}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Price: LKR {gasType ? (gasType.price * item.quantity).toFixed(2) : '0.00'}</Text>
                </View>
              );
            })}

            <Text style={styles.totalAmountText}>
              Total Amount: LKR {selectedOrder.totalAmount.toFixed(2)}
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