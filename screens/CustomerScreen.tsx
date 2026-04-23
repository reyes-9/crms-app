import { CustomerCard } from '@/components/CustomerCard';
import { ReusableModal } from '@/components/ReusableModal';
import SearchInput from '@/components/SearchInput';
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
  // console.log('useCustomer is:', typeof useCustomer);
  const {
    searchCustomer,
    deleteCustomer,
    archiveCustomer,
    getCustomers,
    customers,
  } = useCustomer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

  async function handleSearch(query: string) {
    if (!query.trim()) {
      await getCustomers();
    }
    await searchCustomer(query);
  }

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
      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Permanent Deletion"
        message="Once deleted, this record cannot be recovered. If you think you might need it later, consider archiving instead."
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

      <View style={{ flex: 1 }}>
        <SearchInput onSearch={handleSearch} />

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
                navigation.navigate('Customer Details', {
                  customer_id: item.id,
                });
                console.log(item.id);
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
