// CREATE THE LEADFORM.TSX
// CREATE THE LEADFORM.TSX
// CREATE THE LEADFORM.TSX
// CREATE THE LEADFORM.TSX
// FOR THE ADD LEAD
// FOR THE ADD LEAD
// FOR THE ADD LEAD

import SearchInput from '@/components/SearchInput';
import { useLead } from '@/hooks/useLead';
import { DS } from '@/theme/design';
import { LeadProfile, LeadStatus } from '@/types/lead';
import { formatCurrency } from '@/utils/formatCurrency';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type FilterOption = 'all' | LeadStatus;

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  unqualified: 'Unqualified',
  converted: 'Converted',
  lost: 'Lost',
};

const STATUS_COLOR: Record<LeadStatus, { bg: string; color: string }> = {
  new: { bg: '#DBEAFE', color: '#1D4ED8' },
  contacted: { bg: '#FEF3C7', color: '#B45309' },
  qualified: { bg: '#DCFCE7', color: '#15803D' },
  unqualified: { bg: '#FEE2E2', color: '#B91C1C' },
  converted: { bg: '#ECFDF5', color: '#047857' },
  lost: { bg: '#F1F5F9', color: '#475569' },
};

const FILTER_OPTIONS: FilterOption[] = [
  'all',
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'converted',
  'lost',
];

const StatChip = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statChip}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export const LeadScreen = () => {
  const navigation = useNavigation<any>();
  const tabBarHeight = useBottomTabBarHeight();

  const { leads, getLeads, searchLead } = useLead();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      await getLeads();
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await getLeads();
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSearch(query: string) {
    if (!query.trim()) {
      await getLeads();
      return;
    }
    await searchLead(query);
  }

  const filteredLeads =
    selectedFilter === 'all'
      ? leads
      : leads.filter((lead) => lead.status === selectedFilter);

  const renderItem: ListRenderItem<LeadProfile> = ({ item }) => {
    const status = STATUS_COLOR[item.status];

    return (
      <Pressable
        style={styles.leadCard}
        onPress={() =>
          navigation.navigate('LeadDetails', {
            lead: item,
          })
        }
      >
        <View style={[styles.avatar, { backgroundColor: status.bg }]}>
          <Text style={[styles.avatarText, { color: status.color }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.name}</Text>

          {!!item.company && <Text style={styles.company}>{item.company}</Text>}

          <Text style={styles.meta}>
            {item.source} • {/*formatCurrency(item.value, 'en-PH', 'PHP')*/}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {STATUS_LABEL[item.status]}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.stateScreen}>
        <ActivityIndicator size="large" color={DS.color.primary} />
        <Text style={styles.stateText}>Loading leads…</Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.container} onPress={() => setFilterOpen(false)}>
      {/* LIST */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.listHeader}>
              <View style={styles.pageHeader}>
                <View style={styles.titleBlock}>
                  <Text style={styles.eyebrow}>CRM</Text>
                  <Text style={styles.pageTitle}>Leads</Text>
                  <Text style={styles.pageSubtitle}>
                    Manage and track potential customers
                  </Text>
                </View>
                <View style={styles.headerIcon}>
                  <Feather name="users" size={18} color={DS.color.primary} />
                </View>
              </View>

              <Pressable
                style={styles.addButton}
                onPress={() => {
                  navigation.navigate('LeadForm');
                }}
              >
                <Feather name="plus" size={18} color={DS.color.textInverse} />
                <Text style={styles.addButtonText}>Add Lead</Text>
              </Pressable>

              {/* SEARCH */}
              <SearchInput onSearch={handleSearch} />

              {/* STATS */}
              <View style={styles.statsRow}>
                <StatChip label="Total" value={leads.length} />
                <StatChip
                  label="Qualified"
                  value={leads.filter((l) => l.status === 'qualified').length}
                />
                <StatChip
                  label="Converted"
                  value={leads.filter((l) => l.status === 'converted').length}
                />
              </View>

              <Text style={styles.listLabel}>ALL LEADS</Text>
            </View>

            {/* FILTER */}
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
          </>
        }
        contentContainerStyle={{
          padding: DS.spacing.lg,
          paddingBottom: tabBarHeight + 24,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No leads found.</Text>
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  listHeader: {
    paddingTop: DS.spacing.xs,
    gap: DS.spacing.md,
  },

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleBlock: {
    flex: 1,
    paddingRight: DS.spacing.md,
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

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primaryMuted,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
  },

  statChip: {
    flex: 1,
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

  listLabel: {
    ...DS.typography.eyebrow,
    marginTop: DS.spacing.xs,
  },

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

  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DS.spacing.lg,
    borderRadius: DS.radius.lg,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    marginBottom: DS.spacing.sm,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },

  leadInfo: {
    flex: 1,
    marginLeft: 12,
  },

  leadName: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },

  company: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginTop: 2,
  },

  meta: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontWeight: '500',
    color: DS.color.textMuted,
    letterSpacing: 0.2,
  },
});
