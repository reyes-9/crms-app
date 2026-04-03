import { CustomerCard } from '@/components/CustomerCard';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { CustomerProfile } from '../types/customer';

const getBaseURL = () => {
  // if (Platform.OS === 'android') return 'http://127.0.0.1:8000';
  if (Platform.OS === 'ios') return 'http://localhost:8000';
  return 'http://127.0.0.1:8000';
};

//create an axios instance called "api"
const api = axios.create({
  baseURL: `${getBaseURL()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const CustomerScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]); // w/ customer profile interface (types)

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers/');
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      const error = err as AxiosError;
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }
  if (error) {
    // Show error message if something went wrong
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomerCard
            name={item.name}
            email={item.email}
            company={item.company}
            number={item.number}
          />
        )}
      />
    </View>
  );
};
