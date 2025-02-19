import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Util from './util/utils';
import ApiService from './services/apiService';

interface Order {
  id: number;
  Tank: string[];
  order: string[];
  Total: String;
  Date: String;
  Status: String;
  contact: String;
  customer: String;
}

interface GasType {
  id: number;
  name: string;
  price: number;
}

const GAS_TYPES: GasType[] = [
  { id: 1, name: '2.5 Kg', price: 500.00 },
  { id: 2, name: '5 Kg', price: 1000.00 },
  { id: 3, name: '12.5 Kg', price: 2500.00 }
];

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const customerid = await Util.getData('customerId'); // For customers
    const businessid = await Util.getData('businessId'); // For businesses

    console.log('Customer ID from localStorage:', customerid);
    console.log('Business ID from localStorage:', businessid);

    const endpoint = businessid ? `/business-orders/${businessid}` : `/customer-orders/${customerid}`;
    console.log(`Fetching orders for ${businessid ? 'business' : 'customer'} ID: ${businessid || customerid}`);

    try {
      const response: Order[] = await ApiService.get(endpoint);
      console.log('fetch orders', response);

      setOrders(response);
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
            Total Amount: LKR {item.Total}
          </Text>
          <Text style={{ color: '#6b7280' }}>
            Date: {item.Date}
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
            <Text>Date: {selectedOrder.Date}</Text>

            <Text style={styles.detailsSubtitle}>Order Items:</Text>
            {selectedOrder.Tank.map((item, index) => {
              const [weight, quantity] = item.split(': '); // Split into weight & quantity
              console.log('weight ' + weight);

              const gasType = GAS_TYPES.find(g => g.name.trim().toLowerCase() === weight.trim().toLowerCase());
              console.log('gasType ' + gasType);

              // Only render if quantity is greater than 0
              if (parseInt(quantity.trim()) > 0) {
                return (
                  <View key={index} style={styles.orderItemDetails}>
                    <Text>{weight} Gas</Text>
                    <Text>Quantity: {quantity}</Text>
                    <Text>Price: LKR {gasType ? gasType.price : 'Rs 0.00'}</Text>
                  </View>
                );
              }
              return null; // Return null if quantity is not greater than 0
            })}


            <Text style={styles.totalAmountText}>
              Total Amount: LKR {selectedOrder.Total}
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