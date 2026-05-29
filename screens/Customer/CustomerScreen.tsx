import { CustomerCard } from '@/components/CustomerCard';
import { ReusableModal } from '@/components/ReusableModal';
import SearchInput from '@/components/SearchInput';
import SwipeableRow from '@/components/SwipeableRow';
import { useCustomer } from '@/hooks/useCustomer';
import { DS } from '@/theme/design';
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

/* ─── Screen ──────────────────────────────────────── */

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
        setError(err instanceof Error ? err.message : String(err));
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

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <GestureHandlerRootView style={styles.screen}>
      {/* ── DELETE MODAL ──────────────────────── */}
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
            variant: 'danger',
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
                  err?.response?.data?.message ?? 'Failed to delete',
                );
              }
            },
          },
        ]}
        onClose={() => setDeleteModalVisible(false)}
      />

      {/* ── ARCHIVE MODAL ─────────────────────── */}
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
                  err?.response?.data?.message ?? 'Failed to archive',
                );
              }
            },
          },
        ]}
        onClose={() => setArchiveModalVisible(false)}
      />

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* ── PAGE HEADER ──────────────────── */}
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.eyebrow}>CRM</Text>
                <Text style={styles.pageTitle}>Customers</Text>
              </View>
              <View style={styles.headerIconBtn}>
                <Feather name="users" size={18} color={DS.color.primary} />
              </View>
            </View>

            {/* ── ADD BUTTON ───────────────────── */}
            <Pressable style={styles.addButton}>
              <Feather name="plus" size={18} color={DS.color.textInverse} />
              <Text style={styles.addButtonText}>Add Customer</Text>
            </Pressable>

            {/* ── SEARCH ───────────────────────── */}
            <SearchInput onSearch={handleSearch} />

            {/* ── STATS ROW ────────────────────── */}
            <View style={styles.statsRow}>
              <StatChip label="Total" value={customers.length} />
            </View>

            <Text style={styles.listLabel}>ALL CUSTOMERS</Text>
          </View>
        }
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
                navigation.navigate('CustomerDetails', { customer: item });
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
        ListEmptyComponent={<EmptyState />}
      />
    </GestureHandlerRootView>
  );
};

/* ─── Sub-components ──────────────────────────────── */

const StatChip = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statChip}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const EmptyState = () => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <Feather name="users" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No customers found</Text>
    <Text style={styles.emptyDesc}>
      Add your first customer to get started.
    </Text>
  </View>
);

const LoadingScreen = () => (
  <View style={styles.stateScreen}>
    <ActivityIndicator size="large" color={DS.color.primary} />
    <Text style={styles.stateText}>Loading customers…</Text>
  </View>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <View style={styles.stateScreen}>
    <Feather name="alert-circle" size={32} color={DS.color.danger} />
    <Text style={[styles.stateText, { color: DS.color.danger }]}>{error}</Text>
  </View>
);

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },
  listContent: {
    paddingHorizontal: DS.spacing.xl,
    paddingBottom: 32,
  },
  listHeader: {
    paddingTop: DS.spacing.xl,
    gap: DS.spacing.md,
    marginBottom: DS.spacing.sm,
  },

  // HEADER
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: 2,
  },
  pageTitle: {
    ...DS.typography.screenTitle,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ADD BUTTON
  addButton: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...DS.shadow.sm,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.color.textInverse,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
  },
  statChip: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DS.color.primary,
  },
  statLabel: {
    fontSize: 11,
    color: DS.color.textMuted,
    marginTop: 2,
  },

  // LIST LABEL
  listLabel: {
    ...DS.typography.eyebrow,
    marginTop: DS.spacing.xs,
  },

  // EMPTY
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: DS.spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: DS.radius.xl,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DS.spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: DS.color.textMuted,
    textAlign: 'center',
  },

  // STATES
  stateScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DS.color.bg,
    gap: DS.spacing.md,
  },
  stateText: {
    fontSize: 14,
    color: DS.color.textSecondary,
  },
});
