// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: MAKE THE UI WORK (   ARCHIVE,  DELETE,  SEARCH    )

// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )
// TODO's: CREATE A LITTLE TOAST AT THE TOP THAT SAYS THE OPERATION IS COMPLETE (   ARCHIVE,  DELETE,  SEARCH    )

import { CustomerCard } from '@/components/CustomerCard';

import { ReusableModal } from '@/components/ReusableModal';
import SearchBar from '@/components/Searchbar';
import SwipeableRow from '@/components/SwipeableRow'; // your wrapper
import { useCustomer } from '@/hooks/useCustomer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const CustomerScreen = () => {
  const navigation = useNavigation<any>();

  const { deleteCustomer, archiveCustomer, getCustomers, customers } =
    useCustomer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [query, setQuery] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

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
      {/* Background Blur */}

      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Delete this record?"
        message="This action cannot be undone. Deleted data will be permanently removed."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setDeleteModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Delete',
            onPress: async () => {
              try {
                if (selectedCustomerId !== null) {
                  await deleteCustomer(selectedCustomerId);
                  setSelectedCustomerId(null);
                  setDeleteModalVisible(false);
                  setLoading(true);
                  await getCustomers();
                  setLoading(false);
                }
              } catch (err: any) {
                Alert.alert(
                  'Error',
                  err?.response?.data?.message || 'Failed to archive customer',
                );
              }
            },
            variant: 'danger',
          },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />
      <ReusableModal
        state="neutral"
        visible={archiveModalVisible}
        title="Archive this record?"
        message="This record will be moved to archive. You can restore it later."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setArchiveModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Archive',
            onPress: async () => {
              try {
                if (selectedCustomerId !== null) {
                  await archiveCustomer(selectedCustomerId);
                  setSelectedCustomerId(null);
                  setArchiveModalVisible(false);
                  setLoading(true);
                  await getCustomers();
                  setLoading(false);
                }
              } catch (err: any) {
                Alert.alert(
                  'Error',
                  err?.response?.data?.message || 'Failed to archive customer',
                );
              }
            },
            variant: 'dark',
          },
        ]}
        onClose={() => setArchiveModalVisible(false)}
      />
      {/* FOR MODAL TESTING */}

      {/* <Pressable
        style={{ padding: 10, backgroundColor: 'gray' }}
        onPress={() => setModalVisible(true)}
      >
        <Text>Open Modal</Text>
      </Pressable> */}
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
                console.log('View Record');
                // setArchiveModalVisible(true);
              }}
            >
              <SwipeableRow
                rowId={item.id.toString()}
                isOpen={openRow === item.id.toString()}
                onOpen={(id) => setOpenRow(id)}
                onClose={() => setOpenRow(null)}
                onDelete={() => {
                  console.log('delete is pressed');
                  setSelectedCustomerId(item.id);
                  setDeleteModalVisible(true);
                }}
                onArchive={() => {
                  console.log('archive is pressed: ', typeof item.id);
                  setSelectedCustomerId(item.id);
                  setArchiveModalVisible(true);
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
