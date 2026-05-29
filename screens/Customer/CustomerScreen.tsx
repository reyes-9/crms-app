import { CustomerCard } from '@/components/CustomerCard';
import { ReusableModal } from '@/components/ReusableModal';
import SearchInput from '@/components/SearchInput';
import SwipeableRow from '@/components/SwipeableRow';
import { useCustomer } from '@/hooks/useCustomer';
import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const CustomerScreen = () => {
  const navigation = useNavigation<any>();

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
      return;
    }
    await searchCustomer(query);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getCustomers();
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCustomers();
      setOpenRow(null);
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
    <GestureHandlerRootView style={{ margin: 16 }}>
      {/* <ScrollView> */}
      {/* Delete Modal */}
      <ReusableModal
        state="danger"
        visible={deleteModalVisible}
        title="Permanent Deletion"
        message="Once deleted, this record cannot be recovered. Consider archiving instead."
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
                  setOpenRow(null);

                  await getCustomers();
                }
              } catch (err: any) {
                Alert.alert(
                  'Error',
                  err?.response?.data?.message || 'Failed to delete customer',
                );
              }
            },
            variant: 'danger',
          },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />

      {/* Archive Modal */}
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
                  setOpenRow(null);

                  await getCustomers();
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

      <View style={{}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Customers</Text>


          <Pressable
            style={({ pressed }) => [
              theme.components.button.base,
              theme.components.button.sizes.sm.container,
              theme.components.button.variants.primary,
              pressed && styles.buttonPressed,
            ]}
          >
            <Feather
              name="plus"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={theme.components.button.text.variants.primary}>
              Add Customers
            </Text>
          </Pressable>
        </View>

        <SearchInput onSearch={handleSearch} />

        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 12 }}
          renderItem={({ item, index }) => (
            <SwipeableRow
              rowId={item.id.toString()}
              isOpen={openRow === item.id.toString()}
              onOpen={(id) => setOpenRow(id)}
              onClose={() => setOpenRow(null)}
              onDelete={() => {
                setSelectedCustomerId(item.id);
                setDeleteModalVisible(true);
                setOpenRow(null);
              }}
              onArchive={() => {
                setSelectedCustomerId(item.id);
                setArchiveModalVisible(true);
                setOpenRow(null);
              }}
              isHint={index === 0}
            >
              <Pressable
                onPress={() => {
                  setOpenRow(null);
                  navigation.navigate('CustomerDetails', {
                    customer: item,
                  });
                }}
              >
                <CustomerCard
                  id={item.id}
                  name={item.name}
                  email={item.email}
                  company={item.company}
                  number={item.number}
                />
              </Pressable>
            </SwipeableRow>
          )}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No customers found</Text>
            </View>
          }
        />
      </View>
      {/* </ScrollView> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
