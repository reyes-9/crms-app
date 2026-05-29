import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface CustomerNote {
  id: number;
  title: string;
  content: string;
  created_at: string;
  pinned?: boolean;
}

const mockNotes: CustomerNote[] = [
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

export const CustomerNotes = () => {
  const [search, setSearch] = useState('');

  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()),
  );

  const renderNote = ({ item }: { item: CustomerNote }) => {
    return (
      <Pressable style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleWrapper}>
            <Text style={styles.noteTitle}>{item.title}</Text>

            {item.pinned && (
              <View style={styles.pinBadge}>
                <Feather name="bookmark" size={12} color="#2563EB" />
                <Text style={styles.pinText}>Pinned</Text>
              </View>
            )}
          </View>

          <Pressable style={styles.menuButton}>
            <Feather name="more-vertical" size={18} color="#64748B" />
          </Pressable>
        </View>

        <Text style={styles.noteContent}>{item.content}</Text>

        <View style={styles.noteFooter}>
          <View style={styles.dateWrapper}>
            <Feather name="clock" size={13} color="#94A3B8" />
            <Text style={styles.noteDate}>{item.created_at}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Customer Notes</Text>
          <Text style={styles.headerSubtitle}>
            Store and manage important customer information.
          </Text>
        </View>

        <Pressable style={styles.headerIconButton}>
          <Feather name="bell" size={20} color="#2563EB" />
        </Pressable>
      </View>

      <View style={styles.actionContainer}>
        <Pressable style={styles.addButton}>
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Note</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#94A3B8" />

        <TextInput
          placeholder="Search notes"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNote}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={42} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Notes Found</Text>
            <Text style={styles.emptyDescription}>
              Customer notes will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },

  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  addButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  addButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  headerIconButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  noteTitleWrapper: {
    flex: 1,
    paddingRight: 12,
  },

  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  pinBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  pinText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  noteContent: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },

  noteFooter: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  noteDate: {
    marginLeft: 6,
    fontSize: 12,
    color: '#94A3B8',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
