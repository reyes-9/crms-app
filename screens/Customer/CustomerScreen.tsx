// ADD THE STATUS COUNT FOR TOTAL DO NOT INCLUDE THE DELETED
// ADD SORTING FOR ARCHIVED AND ACTIVE (MAYBE RECENTLY DELETED)

import { CustomerCard } from '@/components/CustomerCard';
import SearchInput from '@/components/SearchInput';
import { useCustomer } from '@/hooks/useCustomer';
import { DS } from '@/theme/design';
import { CustomerStatus } from '@/types/customer';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
/* ─── Screen ──────────────────────────────────────── */

export const CustomerScreen = () => {
  type FilterOption = 'all' | CustomerStatus;

  const FILTER_OPTIONS: FilterOption[] = [
    'all',
    'active',
    'archived',
    // 'deleted',
  ];
  const STATUS_LABEL: Record<CustomerStatus, string> = {
    active: 'Active',
    archived: 'Archived',
    deleted: 'Deleted',
  };

  const STATUS_COLOR: Record<CustomerStatus, { bg: string; color: string }> = {
    active: { bg: '#DCFCE7', color: '#15803D' },
    archived: { bg: '#FEF3C7', color: '#B45309' },
    deleted: { bg: '#FEE2E2', color: '#B91C1C' },
  };

  const tabBarHeight = useBottomTabBarHeight();
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
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  const filteredCustomers = customers.filter((customer) => {
    if (selectedFilter === 'all') return true;
    console.log(customer.status);
    return customer.status === selectedFilter;
  });

  console.log('FLITERED: ', filteredCustomers);

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
    <GestureHandlerRootView
      style={[styles.screen, { paddingBottom: tabBarHeight - 8 }]}
    >


      <FlatList
        data={filteredCustomers}
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
              <View style={styles.titleBlock}>
                <Text style={styles.eyebrow}>CRM</Text>
                <Text style={styles.pageTitle}>Customers</Text>
                <Text style={styles.pageSubtitle}>
                  Manage and track customers and accounts
                </Text>
              </View>
              <View style={styles.headerIcon}>
                <Feather name="users" size={18} color={DS.color.primary} />
              </View>
            </View>

            {/* ── ADD BUTTON ───────────────────── */}
            <Pressable
              style={styles.addButton}
              onPress={() => {
                navigation.navigate('CustomerForm');
              }}
            >
              <Feather name="plus" size={18} color={DS.color.textInverse} />
              <Text style={styles.addButtonText}>Add Customer</Text>
            </Pressable>

            {/* ── SEARCH ───────────────────────── */}
            <SearchInput onSearch={handleSearch} />

            {/* ── STATS ROW ────────────────────── */}
            <View style={styles.statsRow}>
              <StatChip label="Active" value={customers.length} />
            </View>

            <Text style={styles.listLabel}>ALL CUSTOMERS</Text>

            <View style={styles.filterWrapper}>
              <Pressable
                style={styles.filterTrigger}
                onPress={() => setFilterOpen((prev) => !prev)}
              >
                <View
                  style={[
                    styles.filterDot,
                    {
                      backgroundColor:
                        selectedFilter === 'all'
                          ? DS.color.textPrimary
                          : STATUS_COLOR[selectedFilter].color,
                    },
                  ]}
                />

                <Text style={styles.filterTriggerText}>
                  {selectedFilter === 'all'
                    ? 'All Leads'
                    : STATUS_LABEL[selectedFilter]}
                </Text>

                <Feather
                  name={filterOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={DS.color.textSecondary}
                />
              </Pressable>

              {filterOpen && (
                <View style={styles.dropdown}>
                  {FILTER_OPTIONS.map((option) => {
                    const active = option === selectedFilter;

                    return (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownItem,
                          active && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedFilter(option);
                          setFilterOpen(false);
                        }}
                      >
                        {option !== 'all' && (
                          <View
                            style={[
                              styles.filterDot,
                              { backgroundColor: STATUS_COLOR[option].color },
                            ]}
                          />
                        )}

                        <Text
                          style={[
                            styles.dropdownText,
                            active && styles.dropdownTextActive,
                          ]}
                        >
                          {option === 'all'
                            ? 'All Leads'
                            : STATUS_LABEL[option]}
                        </Text>

                        {active && (
                          <Feather
                            name="check"
                            size={14}
                            color={DS.color.primary}
                            style={{ marginLeft: 'auto' }}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
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
              status={item.status}
            />
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState />}
      />
    </GestureHandlerRootView>
  );
};

/* ─── Sub-components ──────────────────────────────── */

const StatChip = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statChip}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
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
    padding: DS.spacing.lg,
    paddingBottom: 32,
  },
  listHeader: {
    paddingTop: DS.spacing.xs,
    gap: DS.spacing.md,
    marginBottom: DS.spacing.md,
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
  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: DS.color.textSecondary,
    lineHeight: 18,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingRight: DS.spacing.md,
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
    // flex: 1,
    width: 120,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: DS.color.textMuted,
  },

  statValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },

  // LIST LABEL
  listLabel: {
    ...DS.typography.eyebrow,
    marginTop: DS.spacing.xs,
  },

  // EMPTY
  empty: {
    alignItems: 'center',
    paddingVertical: DS.spacing.xxxl,
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

  // FILTER

  // FILTER (unchanged but required)
  filterWrapper: {
    // paddingHorizontal: DS.spacing.lg,
    marginVertical: DS.spacing.md,
    zIndex: 100,
  },

  filterTrigger: {
    height: 46,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    backgroundColor: DS.color.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.md,
    gap: 8,
  },

  filterTriggerText: {
    flex: 1,
    color: DS.color.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  dropdown: {
    marginTop: 6,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: 12,
  },

  dropdownItemActive: {
    backgroundColor: DS.color.primaryMuted,
  },

  dropdownText: {
    fontSize: 13,
    color: DS.color.textSecondary,
  },

  dropdownTextActive: {
    color: DS.color.primary,
    fontWeight: '600',
  },
});
