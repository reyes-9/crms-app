import SearchInput from '@/components/SearchInput';
import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Animated,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ─── Types ─────────────────────────────────────────────
type Lead = {
  id: string;
  name: string;
  company: string;
  status: LeadStatus;
};

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost';

type SortOption =
  | 'all'
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost';

// ─── Sort Menu ─────────────────────────────────────────

const SortMenu = ({
  sortOptions,
  selectedSort,
  setSelectedSort,
}: {
  sortOptions: SortOption[];
  selectedSort: SortOption;
  setSelectedSort: (o: SortOption) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownWrapper}>
      {/* ─── Trigger ───────────────────────────── */}
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        style={styles.dropdownTrigger}
      >
        <Text style={styles.triggerText}>{selectedSort.toUpperCase()}</Text>

        <Text style={styles.arrow}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {/* ─── Dropdown List ─────────────────────── */}
      {open && (
        <View style={styles.dropdown}>
          {sortOptions.map((option) => {
            const isActive = selectedSort === option;

            return (
              <Pressable
                key={option}
                onPress={() => {
                  setSelectedSort(option);
                  setOpen(false);
                }}
                style={[styles.item, isActive && styles.itemActive]}
              >
                <Text
                  style={[styles.itemText, isActive && styles.itemTextActive]}
                >
                  {option.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

// ─── Screen ────────────────────────────────────────────
export const LeadsScreen = () => {
  const dummyLeads: Lead[] = [
    { id: '1', name: 'John Doe', company: 'Acme Corp', status: 'new' },
    { id: '2', name: 'Jane Smith', company: 'Globex Inc', status: 'contacted' },
    {
      id: '3',
      name: 'Michael Johnson',
      company: 'Initech',
      status: 'qualified',
    },
    { id: '4', name: 'Emily Davis', company: 'Umbrella Co', status: 'lost' },
    { id: '5', name: 'Robert Brown', company: 'Soylent Corp', status: 'new' },
    {
      id: '6',
      name: 'Laura Wilson',
      company: 'Stark Industries',
      status: 'contacted',
    },
    {
      id: '7',
      name: 'David Miller',
      company: 'Wayne Enterprises',
      status: 'qualified',
    },
    {
      id: '8',
      name: 'Sophia Taylor',
      company: 'Wonka Industries',
      status: 'lost',
    },
    {
      id: '9',
      name: 'James Anderson',
      company: 'Cyberdyne Systems',
      status: 'new',
    },
    {
      id: '10',
      name: 'Olivia Martinez',
      company: 'Tyrell Corp',
      status: 'contacted',
    },
  ];

  const statusLabel: Record<LeadStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    unqualified: 'Unqualified',
    converted: 'Converted',
    lost: 'Lost',
  };

  const statusColor: Record<LeadStatus, string> = {
    new: '#3B82F6',
    contacted: '#F59E0B',
    qualified: '#10B981',
    unqualified: '#EF4444',
    converted: '#059669',
    lost: '#6B7280',
  };

  const sortOptions: SortOption[] = [
    'all',
    'new',
    'contacted',
    'qualified',
    'converted',
  ];
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('all');

  const filteredLeads =
    selectedSort === 'all'
      ? dummyLeads
      : dummyLeads.filter((l) => l.status === selectedSort);

  // ─── CLEAN SCROLL ANIMATION ───────────────────────────
  const scrollY = useRef(new Animated.Value(0)).current;

  const labelOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.2, 0],
    extrapolate: 'clamp',
  });

  const labelTranslate = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  const renderItem: ListRenderItem<Lead> = ({ item }) => (
    <Pressable
      style={[styles.leadItem, { borderLeftColor: statusColor[item.status] }]}
      onPress={() => {
        console.log('pressed');
      }}
    >
      <Text style={styles.leadName}>{item.name}</Text>
      <Text style={styles.leadCompany}>{item.company}</Text>
      <Text style={[styles.leadStatus, { color: statusColor[item.status] }]}>
        {statusLabel[item.status]}
      </Text>
    </Pressable>
  );

  const ListHeader = () => {
    return (
      <>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leads</Text>

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
              Add Leads
            </Text>
          </Pressable>
        </View>

        {/* SEARCH */}
        <View style={styles.wrapper}>
          <SearchInput onSearch={() => {}} />
        </View>

        {/* STICKY SECTION */}
        <Animated.View
          style={[
            {
              transform: [{ translateY: labelTranslate }],
              // backgroundColor: '#fff',
              zIndex: 10,
            },
          ]}
        >
          <Animated.View style={{ opacity: labelOpacity }}>
            <View style={styles.label}>
              <Text style={styles.small}>SORT BY STATUS</Text>
            </View>
          </Animated.View>

          <SortMenu
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
          />

          <Animated.View style={{ opacity: labelOpacity }}>
            <View style={styles.label}>
              <Text style={styles.small}>LIST VIEW</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // await getLeads
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* LIST */}
      <Animated.FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeader}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

// ─── STYLES ────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, margin: 16, marginBottom: 0 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '600',
  },

  listContainer: {
    // borderRadius: 10,
  },

  leadItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  leadName: { fontSize: 16, fontWeight: '600' },
  leadCompany: { fontSize: 14, color: '#6B7280' },
  leadStatus: { fontSize: 12, marginTop: 6 },

  label: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },

  small: {
    fontSize: theme.typography.fontSize.xxs,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  wrapper: {
    backgroundColor: '#fff',
    paddingBottom: 15,
  },

  dropdownWrapper: {
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 50,
    paddingBottom: 10,
  },

  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  arrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },

  dropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#fff',

    overflow: 'hidden',

    // shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  itemActive: {
    backgroundColor: '#F3F4F6',
  },

  itemText: {
    fontSize: 13,
    color: '#6B7280',
  },

  itemTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
});
