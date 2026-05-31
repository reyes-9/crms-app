import SearchInput from '@/components/SearchInput';
import { DS } from '@/theme/design';
import { LeadProfile } from '@/types/lead';
import { formatCurrency } from '@/utils/formatCurrency';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import {
  Animated,
  ListRenderItem,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* ─── Types ─────────────────────────────────────── */

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost';
type SortOption = 'all' | LeadStatus;

type Lead = {
  id: string;
  name: string;
  email: string;
  number: string;
  company: string;
  status: LeadStatus;
  source: string;
};

/* ─── Constants ──────────────────────────────────── */

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

const SORT_OPTIONS: SortOption[] = [
  'all',
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'converted',
  'lost',
];

const DUMMY_LEADS: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    number: '09171234567',
    status: 'new',
    source: 'website',
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Globex Inc',
    email: 'jane@globex.com',
    number: '09181234567',
    status: 'contacted',
    source: 'referral',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    company: 'Initech',
    email: 'michael@initech.com',
    number: '09192345678',
    status: 'qualified',
    source: 'email',
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Umbrella Co',
    email: 'emily@umbrella.com',
    number: '09175551234',
    status: 'lost',
    source: 'social',
  },
  {
    id: '5',
    name: 'Robert Brown',
    company: 'Soylent Corp',
    email: 'robert@soylent.com',
    number: '09176667777',
    status: 'new',
    source: 'website',
  },
  {
    id: '6',
    name: 'Laura Wilson',
    company: 'Stark Industries',
    email: 'laura@stark.com',
    number: '09178889999',
    status: 'contacted',
    source: 'referral',
  },
  {
    id: '7',
    name: 'David Miller',
    company: 'Wayne Enterprises',
    email: 'david@wayne.com',
    number: '09179990000',
    status: 'qualified',
    source: 'website',
  },
  {
    id: '8',
    name: 'Sophia Taylor',
    company: 'Wonka Industries',
    email: 'sophia@wonka.com',
    number: '09171112222',
    status: 'lost',
    source: 'social',
  },
  {
    id: '9',
    name: 'James Anderson',
    company: 'Cyberdyne Systems',
    email: 'james@cyberdyne.com',
    number: '09173334444',
    status: 'new',
    source: 'email',
  },
  {
    id: '10',
    name: 'Olivia Martinez',
    company: 'Tyrell Corp',
    email: 'olivia@tyrell.com',
    number: '09174445555',
    status: 'contacted',
    source: 'website',
  },
];

/* ═══════════════════════════════════════════════════
   LEAD SCREEN
═══════════════════════════════════════════════════ */

export const LeadScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('all');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const filtered =
    selectedSort === 'all'
      ? DUMMY_LEADS
      : DUMMY_LEADS.filter((l) => l.status === selectedSort);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      /* await getLeads() */
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem: ListRenderItem<Lead> = ({ item }) => {
    const st = STATUS_COLOR[item.status];

    return (
      <Pressable
        style={styles.leadCard}
        onPress={() => navigation.navigate('LeadDetails')}
      >
        {/* Left: avatar */}
        <View style={[styles.leadAvatar, { backgroundColor: st.bg }]}>
          <Text style={[styles.leadAvatarText, { color: st.color }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Center: info */}
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.name}</Text>
          <Text style={styles.leadCompany}>{item.company}</Text>
          <View style={styles.leadMeta}>
            <Feather name="globe" size={11} color={DS.color.textMuted} />
            <Text style={styles.leadMetaText}>{item.source}</Text>
          </View>
        </View>

        {/* Right: status badge */}
        <View style={[styles.leadStatusBadge, { backgroundColor: st.bg }]}>
          <Text style={[styles.leadStatusText, { color: st.color }]}>
            {STATUS_LABEL[item.status]}
          </Text>
        </View>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <>
      {/* PAGE HEADER */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.eyebrow}>CRM</Text>
          <Text style={styles.pageTitle}>Leads</Text>
        </View>
        <View style={styles.headerIconBtn}>
          <Feather name="trending-up" size={18} color={DS.color.primary} />
        </View>
      </View>

      {/* ADD BUTTON */}
      <Pressable style={styles.addButton}>
        <Feather name="plus" size={18} color={DS.color.textInverse} />
        <Text style={styles.addButtonText}>Add Lead</Text>
      </Pressable>

      {/* SEARCH */}
      <SearchInput onSearch={() => {}} />

      {/* SORT FILTER */}
      <View style={styles.sortWrapper}>
        <Text style={styles.sortLabel}>FILTER BY STATUS</Text>

        <Pressable
          style={styles.sortTrigger}
          onPress={() => setSortMenuOpen((p) => !p)}
        >
          <View
            style={[
              styles.sortDot,
              selectedSort !== 'all' && {
                backgroundColor:
                  STATUS_COLOR[selectedSort as LeadStatus]?.color ??
                  DS.color.textPrimary,
              },
              selectedSort === 'all' && {
                backgroundColor: DS.color.textPrimary,
              },
            ]}
          />
          <Text style={styles.sortTriggerText}>
            {selectedSort === 'all'
              ? 'All Leads'
              : STATUS_LABEL[selectedSort as LeadStatus]}
          </Text>
          <Feather
            name={sortMenuOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={DS.color.textSecondary}
          />
        </Pressable>

        {sortMenuOpen && (
          <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map((opt) => {
              const isActive = selectedSort === opt;
              return (
                <Pressable
                  key={opt}
                  style={[
                    styles.sortOption,
                    isActive && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedSort(opt);
                    setSortMenuOpen(false);
                  }}
                >
                  {opt !== 'all' && (
                    <View
                      style={[
                        styles.sortDot,
                        {
                          backgroundColor:
                            STATUS_COLOR[opt as LeadStatus]?.color,
                        },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.sortOptionText,
                      isActive && styles.sortOptionTextActive,
                    ]}
                  >
                    {opt === 'all'
                      ? 'All Leads'
                      : STATUS_LABEL[opt as LeadStatus]}
                  </Text>
                  {isActive && (
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

      <Text style={styles.listLabel}>
        {filtered.length} {filtered.length === 1 ? 'LEAD' : 'LEADS'}
      </Text>
    </>
  );

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: DS.color.bg }}
      onPress={() => setSortMenuOpen(false)}
    >
      <Animated.FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + 30 },
        ]}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
      />
    </Pressable>
  );
};

/* ═══════════════════════════════════════════════════
   LEAD DETAILS SCREEN
═══════════════════════════════════════════════════ */

const STATUS_CHOICES: [string, string][] = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['qualified', 'Qualified'],
  ['converted', 'Converted'],
];

const LEAD_NOTES = [
  {
    id: '1',
    content: 'Followed up with client regarding proposal.',
    createdAt: '2025-04-10',
  },
  {
    id: '2',
    content: 'Client requested a demo next week.',
    createdAt: '2025-04-12',
  },
  {
    id: '3',
    content: 'Sent updated contract for review.',
    createdAt: '2025-04-15',
  },
  { id: '4', content: 'Scheduled demo for April 20.', createdAt: '2025-04-16' },
];

const SAMPLE_LEAD: LeadProfile = {
  id: 'LEAD001',
  name: 'Alice Johnson',
  company: 'Tech Solutions Inc.',
  email: 'alice.johnson@example.com',
  number: '+1234567890',
  status: 'new',
  source: 'website',
  notes: 'Interested in product demo.',
  value: 50000,
};

export const LeadDetailsScreen = () => {
  const currentStatus = SAMPLE_LEAD.status;
  const currentIndex = STATUS_CHOICES.findIndex(([v]) => v === currentStatus);

  const initials = SAMPLE_LEAD.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <ScrollView
      style={styles2.screen}
      contentContainerStyle={styles2.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── PROFILE CARD ─────────────────────── */}
      <View style={styles2.profileCard}>
        <View style={styles2.avatar}>
          <Text style={styles2.avatarText}>{initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles2.profileName}>{SAMPLE_LEAD.name}</Text>
          <Text style={styles2.profileCompany}>{SAMPLE_LEAD.company}</Text>
          <View style={styles2.profileMeta}>
            <View
              style={[
                styles2.statusPill,
                {
                  backgroundColor:
                    STATUS_COLOR[currentStatus as LeadStatus]?.bg,
                },
              ]}
            >
              <Text
                style={[
                  styles2.statusPillText,
                  { color: STATUS_COLOR[currentStatus as LeadStatus]?.color },
                ]}
              >
                {STATUS_LABEL[currentStatus as LeadStatus] ?? currentStatus}
              </Text>
            </View>
            <Text style={styles2.valuePill}>
              {formatCurrency(SAMPLE_LEAD.value, 'en-PH', 'PHP')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles2.editBtn}>
          <Feather name="edit-2" size={14} color={DS.color.primary} />
          <Text style={styles2.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ── QUICK ACTIONS ─────────────────────── */}
      <View style={styles2.actionsRow}>
        <TouchableOpacity style={styles2.actionBtn}>
          <Feather name="phone" size={16} color={DS.color.primary} />
          <Text style={styles2.actionBtnText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles2.actionBtn}>
          <Feather name="mail" size={16} color={DS.color.primary} />
          <Text style={styles2.actionBtnText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles2.actionBtn, styles2.actionBtnPrimary]}>
          <Feather name="trending-up" size={16} color={DS.color.textInverse} />
          <Text
            style={[styles2.actionBtnText, { color: DS.color.textInverse }]}
          >
            Advance Lead
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── PIPELINE ─────────────────────────── */}
      <SectionCard2 title="Pipeline Stage" icon="git-branch">
        <View style={styles2.pipeline}>
          {STATUS_CHOICES.map(([value, label], index) => {
            const isPassed = index < currentIndex;
            const isCurrent =
              index === currentIndex &&
              !['unqualified', 'lost'].includes(currentStatus);
            const isFailed =
              (currentStatus === 'unqualified' && index === 2) ||
              (currentStatus === 'lost' && index === 3);
            const isUpcoming = !isPassed && !isCurrent && !isFailed;
            const isLast = index === STATUS_CHOICES.length - 1;

            const text =
              currentStatus === 'unqualified' && index === 2
                ? 'Unqualified'
                : currentStatus === 'lost' && index === 3
                  ? 'Lost'
                  : label;

            return (
              <View
                key={value}
                style={[
                  styles2.pipelineStage,
                  isPassed && styles2.stagePassed,
                  isCurrent && styles2.stageCurrent,
                  isFailed && styles2.stageFailed,
                  isUpcoming && styles2.stageUpcoming,
                  !isLast && styles2.stageNotLast,
                ]}
              >
                <Text
                  style={[
                    styles2.stageText,
                    isPassed && styles2.stagePassedText,
                    isCurrent && styles2.stageCurrentText,
                    isFailed && styles2.stageFailedText,
                    isUpcoming && styles2.stageUpcomingText,
                  ]}
                >
                  {text}
                </Text>
              </View>
            );
          })}
        </View>
      </SectionCard2>

      {/* ── LEAD INFO ────────────────────────── */}
      <SectionCard2 title="Lead Info" icon="user">
        {[
          { label: 'Email', value: SAMPLE_LEAD.email },
          { label: 'Phone', value: SAMPLE_LEAD.number },
          { label: 'Company', value: SAMPLE_LEAD.company },
          {
            label: 'Status',
            value: STATUS_LABEL[currentStatus as LeadStatus] ?? currentStatus,
          },
          {
            label: 'Source',
            value:
              SAMPLE_LEAD.source.charAt(0).toUpperCase() +
              SAMPLE_LEAD.source.slice(1),
          },
          {
            label: 'Value',
            value: formatCurrency(SAMPLE_LEAD.value, 'en-PH', 'PHP'),
          },
        ].map(({ label, value }, i) => (
          <View key={label}>
            {i > 0 && <View style={styles2.rowDivider} />}
            <View style={styles2.infoRow}>
              <Text style={styles2.infoLabel}>{label}</Text>
              <Text style={styles2.infoValue}>{value}</Text>
            </View>
          </View>
        ))}
      </SectionCard2>

      {/* ── NOTES ────────────────────────────── */}
      <SectionCard2
        title="Notes"
        icon="file-text"
        actionLabel="Manage"
        onAction={() => {}}
      >
        {LEAD_NOTES.map((note, i) => (
          <View key={note.id}>
            {i > 0 && <View style={styles2.rowDivider} />}
            <View style={styles2.noteItem}>
              <Text style={styles2.noteText}>{note.content}</Text>
              <View style={styles2.noteMeta}>
                <Feather name="clock" size={11} color={DS.color.textMuted} />
                <Text style={styles2.noteMetaText}>{note.createdAt} · you</Text>
              </View>
            </View>
          </View>
        ))}
      </SectionCard2>
    </ScrollView>
  );
};

/* ─── Shared sub-components ──────────────────────── */

const SectionCard2 = ({
  title,
  icon,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) => (
  <View style={styles2.sectionCard}>
    <View style={styles2.sectionHeader}>
      <View style={styles2.sectionTitleRow}>
        <View style={styles2.sectionIconWrap}>
          <Feather name={icon} size={13} color={DS.color.primary} />
        </View>
        <Text style={styles2.sectionTitle}>{title}</Text>
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles2.sectionAction} onPress={onAction}>
          <Text style={styles2.sectionActionText}>{actionLabel}</Text>
          <Feather name="chevron-right" size={13} color={DS.color.primary} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles2.sectionBody}>{children}</View>
  </View>
);

const EmptyState = () => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconWrap}>
      <Feather name="trending-up" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No leads found</Text>
    <Text style={styles.emptyDesc}>
      Try a different filter or add a new lead.
    </Text>
  </View>
);

/* ─── LeadScreen Styles ──────────────────────────── */

const styles = StyleSheet.create({
  // HEADER
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.xl,
    paddingTop: DS.spacing.xl,
    paddingBottom: DS.spacing.md,
  },
  eyebrow: { ...DS.typography.eyebrow, marginBottom: 2 },
  pageTitle: { ...DS.typography.screenTitle },
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
    marginHorizontal: DS.spacing.xl,
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...DS.shadow.sm,
    marginBottom: DS.spacing.md,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.color.textInverse,
  },

  // SORT
  sortWrapper: {
    marginHorizontal: DS.spacing.xl,
    marginTop: DS.spacing.md,
    zIndex: 50,
  },
  sortLabel: { ...DS.typography.eyebrow, marginBottom: 8 },
  sortTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    paddingHorizontal: DS.spacing.md,
    height: 46,
  },
  sortDot: {
    width: 8,
    height: 8,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.textPrimary,
  },
  sortTriggerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: DS.color.textPrimary,
  },
  sortDropdown: {
    marginTop: 6,
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    overflow: 'hidden',
    ...DS.shadow.md,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: DS.spacing.md,
  },
  sortOptionActive: { backgroundColor: DS.color.primaryMuted },
  sortOptionText: { fontSize: 13, color: DS.color.textSecondary },
  sortOptionTextActive: { fontWeight: '700', color: DS.color.primary },

  // LIST
  listLabel: {
    ...DS.typography.eyebrow,
    paddingHorizontal: DS.spacing.xl,
    marginTop: DS.spacing.lg,
    marginBottom: DS.spacing.sm,
  },
  listContent: { paddingHorizontal: DS.spacing.xl, paddingBottom: 32 },

  // LEAD CARD
  leadCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    marginBottom: DS.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    ...DS.shadow.sm,
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadAvatarText: { fontSize: 16, fontWeight: '700' },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 15, fontWeight: '700', color: DS.color.textPrimary },
  leadCompany: { fontSize: 13, color: DS.color.textSecondary, marginTop: 1 },
  leadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  leadMetaText: {
    fontSize: 11,
    color: DS.color.textMuted,
    textTransform: 'capitalize',
  },
  leadStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radius.full,
  },
  leadStatusText: { fontSize: 11, fontWeight: '600' },

  // EMPTY
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: DS.spacing.sm },
  emptyIconWrap: {
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
  emptyTitle: { fontSize: 16, fontWeight: '700', color: DS.color.textPrimary },
  emptyDesc: { fontSize: 13, color: DS.color.textMuted, textAlign: 'center' },
});

/* ─── LeadDetailsScreen Styles ───────────────────── */

const styles2 = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DS.color.bg },
  content: { padding: DS.spacing.xl, gap: DS.spacing.md, paddingBottom: 40 },

  profileCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DS.spacing.md,
    ...DS.shadow.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: DS.color.primary },
  profileName: { fontSize: 17, fontWeight: '700', color: DS.color.textPrimary },
  profileCompany: { fontSize: 13, color: DS.color.textSecondary, marginTop: 2 },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radius.full,
  },
  statusPillText: { fontSize: 11, fontWeight: '600' },
  valuePill: { fontSize: 13, fontWeight: '600', color: DS.color.textPrimary },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DS.color.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.primaryLight,
  },
  editBtnText: { fontSize: 13, fontWeight: '600', color: DS.color.primary },

  actionsRow: { flexDirection: 'row', gap: DS.spacing.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  actionBtnPrimary: {
    backgroundColor: DS.color.primary,
    borderColor: DS.color.primary,
    flex: 1.5,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: DS.color.primary },

  // PIPELINE
  pipeline: {
    flexDirection: 'row',
    borderRadius: DS.radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  pipelineStage: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNotLast: { borderRightWidth: 1, borderRightColor: DS.color.border },
  stageText: { fontSize: 10, fontWeight: '700' },
  stagePassed: { backgroundColor: DS.color.successLight },
  stagePassedText: { color: DS.color.success },
  stageCurrent: { backgroundColor: DS.color.primary },
  stageCurrentText: { color: DS.color.textInverse },
  stageUpcoming: { backgroundColor: DS.color.bg },
  stageUpcomingText: { color: DS.color.textMuted },
  stageFailed: { backgroundColor: DS.color.dangerLight },
  stageFailedText: { color: DS.color.danger },

  // SECTION CARD
  sectionCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: DS.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: DS.radius.xs,
    backgroundColor: DS.color.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.color.primary,
  },
  sectionBody: { padding: DS.spacing.lg },

  rowDivider: { height: 1, backgroundColor: DS.color.borderLight },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DS.spacing.sm,
  },
  infoLabel: { fontSize: 13, color: DS.color.textSecondary },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.color.textPrimary,
    textAlign: 'right',
    maxWidth: '60%',
  },

  noteItem: { paddingVertical: DS.spacing.sm, gap: 6 },
  noteText: { fontSize: 14, lineHeight: 22, color: DS.color.textSecondary },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  noteMetaText: { fontSize: 11, color: DS.color.textMuted },
});
