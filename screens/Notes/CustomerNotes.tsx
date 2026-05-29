import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DS } from '@/theme/design';

/* ─── Types ─────────────────────────────────────── */

interface CustomerNote {
  id: number;
  title: string;
  content: string;
  created_at: string;
  pinned?: boolean;
}

/* ─── Mock Data ─────────────────────────────────── */

const MOCK_NOTES: CustomerNote[] = [
  {
    id: 1,
    title: 'Delivery Preference',
    content: 'Customer prefers afternoon delivery between 1PM and 4PM.',
    created_at: 'May 29, 2026',
    pinned: true,
  },
  {
    id: 2,
    title: 'Payment Reminder',
    content: 'Requested reminder before due date for monthly orders.',
    created_at: 'May 27, 2026',
  },
  {
    id: 3,
    title: 'Special Packaging',
    content: 'Fragile items should always be packed separately.',
    created_at: 'May 24, 2026',
  },
];

/* ─── Screen ─────────────────────────────────────── */

export const CustomerNotes = () => {
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = MOCK_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const renderNote = ({ item }: { item: CustomerNote }) => (
    <Pressable style={styles.noteCard} onPress={() => setOpenMenu(null)}>
      {/* Header row */}
      <View style={styles.noteHeader}>
        <View style={styles.noteTitleRow}>
          {item.pinned && (
            <View style={styles.pinBadge}>
              <Feather name="bookmark" size={11} color={DS.color.primary} />
              <Text style={styles.pinText}>Pinned</Text>
            </View>
          )}
          <Text style={styles.noteTitle}>{item.title}</Text>
        </View>

        {/* 3-dot menu */}
        <View>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setOpenMenu(openMenu === item.id ? null : item.id)}
          >
            <Feather
              name="more-vertical"
              size={16}
              color={DS.color.textSecondary}
            />
          </TouchableOpacity>

          {openMenu === item.id && (
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setOpenMenu(null);
                  // TODO: handle edit
                }}
              >
                <Feather name="edit-2" size={13} color={DS.color.textPrimary} />
                <Text style={styles.menuItemText}>Edit</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setOpenMenu(null);
                  // TODO: handle delete
                }}
              >
                <Feather name="trash-2" size={13} color={DS.color.danger} />
                <Text style={[styles.menuItemText, { color: DS.color.danger }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <Text style={styles.noteContent}>{item.content}</Text>

      {/* Footer */}
      <View style={styles.noteFooter}>
        <Feather name="clock" size={11} color={DS.color.textMuted} />
        <Text style={styles.noteDate}>{item.created_at}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable style={{ flex: 1 }} onPress={() => setOpenMenu(null)}>
        {/* ── HEADER ───────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CUSTOMER</Text>
            <Text style={styles.pageTitle}>Notes</Text>
            <Text style={styles.pageSubtitle}>
              Store and manage important customer information
            </Text>
          </View>
          <View style={styles.headerIconBtn}>
            <Feather name="file-text" size={18} color={DS.color.primary} />
          </View>
        </View>

        {/* ── ADD BUTTON ───────────────────────── */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.addButton}>
            <Feather name="plus" size={18} color={DS.color.textInverse} />
            <Text style={styles.addButtonText}>Add Note</Text>
          </Pressable>
        </View>

        {/* ── SEARCH ───────────────────────────── */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color={DS.color.textMuted} />
          <TextInput
            placeholder="Search notes…"
            placeholderTextColor={DS.color.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={15} color={DS.color.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── LIST ─────────────────────────────── */}
        <FlatList
          data={[...pinned, ...unpinned]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNote}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            pinned.length > 0 ? (
              <Text style={styles.groupLabel}>PINNED</Text>
            ) : null
          }
          ListEmptyComponent={<EmptyState />}
        />
      </Pressable>
    </SafeAreaView>
  );
};

/* ─── Sub-components ──────────────────────────────── */

const EmptyState = () => (
  <View style={styles.empty}>
    <View style={styles.emptyIconWrap}>
      <Feather name="file-text" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No Notes Found</Text>
    <Text style={styles.emptyDesc}>Customer notes will appear here.</Text>
  </View>
);

/* ─── Styles ──────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },

  // HEADER
  header: {
    paddingHorizontal: DS.spacing.xl,
    paddingTop: DS.spacing.xl,
    paddingBottom: DS.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...DS.typography.eyebrow,
    marginBottom: 2,
  },
  pageTitle: {
    ...DS.typography.screenTitle,
  },
  pageSubtitle: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginTop: 4,
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
    marginTop: 4,
  },

  // ADD BUTTON
  actionContainer: {
    paddingHorizontal: DS.spacing.xl,
    marginBottom: DS.spacing.md,
  },
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

  // SEARCH
  searchContainer: {
    marginHorizontal: DS.spacing.xl,
    marginBottom: DS.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    paddingHorizontal: DS.spacing.md,
    height: 48,
    gap: DS.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DS.color.textPrimary,
  },

  // GROUP LABEL
  groupLabel: {
    ...DS.typography.eyebrow,
    marginBottom: DS.spacing.sm,
  },

  // LIST
  listContent: {
    paddingHorizontal: DS.spacing.xl,
    paddingBottom: 32,
  },

  // NOTE CARD
  noteCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    marginBottom: DS.spacing.md,
    ...DS.shadow.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: DS.spacing.sm,
  },
  noteTitleRow: {
    flex: 1,
    gap: DS.spacing.xs,
    paddingRight: DS.spacing.sm,
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: DS.color.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DS.radius.full,
    marginBottom: DS.spacing.xs,
  },
  pinText: {
    fontSize: 11,
    fontWeight: '600',
    color: DS.color.primary,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 22,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.md,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteDate: {
    fontSize: 11,
    color: DS.color.textMuted,
  },

  // MENU
  menuBtn: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.color.bg,
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 36,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.sm,
    borderWidth: 1,
    borderColor: DS.color.border,
    width: 130,
    zIndex: 99,
    ...DS.shadow.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: DS.spacing.sm,
    paddingHorizontal: DS.spacing.md,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.color.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: DS.color.border,
  },

  // EMPTY
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: DS.spacing.sm,
  },
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
});
