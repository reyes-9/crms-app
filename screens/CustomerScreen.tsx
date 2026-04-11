// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )

import { CustomerCard } from '@/components/CustomerCard';

import SearchBar from '@/components/Searchbar';
import SwipeableRow from '@/components/SwipeableRow'; // your wrapper
import { useCustomer } from '@/hooks/useCustomer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const CustomerScreen = () => {
  const navigation = useNavigation<any>();

  const { getCustomers, customers } = useCustomer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [query, setQuery] = useState('');

  // Filter customers by search query
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase()),
  );

  // Fetch customers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getCustomers(); // updates context state
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCustomers();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search" />

        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.push('/');
              }}
            >
              <SwipeableRow
                rowId={item.id.toString()}
                isOpen={openRow === item.id.toString()}
                onOpen={(id) => setOpenRow(id)}
                onClose={() => setOpenRow(null)}
                onDelete={() => {
                  console.log('deleted');
                }}
              >
                <CustomerCard
                  id={item.id}
                  name={item.name}
                  email={item.email}
                  company={item.company}
                  number={item.number}
                />
              </SwipeableRow>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No customers found</Text>
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};
