import { useLeadNote } from '@/hooks/useLeadNote';
import { DS } from '@/theme/design';
import { LeadNoteDetails } from '@/types/leadNote';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/* ─── Screen ─────────────────────────────────────── */

export const LeadNotes = () => {
  const { leadNotes, isLoading, getLeadNotes, deleteLeadNote } = useLeadNote();

  const route = useRoute();
  const { lead_id } = route.params as { lead_id: number };

  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<LeadNoteDetails | null>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getLeadNotes(lead_id);
  }, [lead_id]);

  /* ── Filtering ──────────────────────────────────── */

  const filtered = leadNotes.filter(
    (n: LeadNoteDetails) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((n: LeadNoteDetails) => n.pinned);
  const unpinned = filtered.filter((n: LeadNoteDetails) => !n.pinned);

  /* ── Actions ────────────────────────────────────── */

  const handleOpenAdd = () => {
    setEditingNote(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (note: LeadNoteDetails) => {
    setOpenMenu(null);
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleDeletePress = (note_id: number) => {
    setOpenMenu(null);
    setDeleteTarget(note_id);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget == null) return;
    try {
      setIsDeleting(true);
      await deleteLeadNote(deleteTarget);
    } catch {
      // TODO: surface error toast
    } finally {
      setIsDeleting(false);
      setDeleteConfirmVisible(false);
      setDeleteTarget(null);
    }
  };

  /* ── Render note ────────────────────────────────── */

  const renderNote = useCallback(
    ({ item }: { item: LeadNoteDetails }) => (
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
                  onPress={() => handleOpenEdit(item)}
                >
                  <Feather
                    name="edit-2"
                    size={13}
                    color={DS.color.textPrimary}
                  />
                  <Text style={styles.menuItemText}>Edit</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleDeletePress(item.id)}
                >
                  <Feather name="trash-2" size={13} color={DS.color.danger} />
                  <Text
                    style={[styles.menuItemText, { color: DS.color.danger }]}
                  >
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
          <Text style={styles.noteDate}>
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'}
          </Text>
        </View>
      </Pressable>
    ),
    [openMenu],
  );

  /* ── Main render ────────────────────────────────── */

  return (
    <View style={styles.screen}>
      <Pressable style={{ flex: 1 }} onPress={() => setOpenMenu(null)}>
        {/* ── HEADER ───────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LEAD</Text>
            <Text style={styles.pageTitle}>Notes</Text>
            <Text style={styles.pageSubtitle}>
              Store and manage important lead information
            </Text>
          </View>
          <View style={styles.headerIconBtn}>
            <Feather name="file-text" size={18} color={DS.color.primary} />
          </View>
        </View>

        {/* ── ADD BUTTON ───────────────────────── */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.addButton} onPress={handleOpenAdd}>
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
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={DS.color.primary} />
          </View>
        ) : (
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
        )}
      </Pressable>

      {/* ── NOTE FORM MODAL ───────────────────── */}
      <NoteFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingNote={editingNote}
        lead_id={lead_id}
      />

      {/* ── DELETE CONFIRM MODAL ──────────────── */}
      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
};

/* ─── Note Form Modal ─────────────────────────────── */

interface NoteFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingNote: LeadNoteDetails | null;
  lead_id: number;
}

const NoteFormModal = ({
  visible,
  onClose,
  editingNote,
  lead_id,
}: NoteFormModalProps) => {
  const { addLeadNote, editLeadNote } = useLeadNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {},
  );
  const titleRef = useRef<TextInput>(null);
  const inputRef = useRef<TextInput>(null);

  const isEdit = editingNote != null;

  // Populate on open
  useEffect(() => {
    if (visible) {
      setTitle(editingNote?.title ?? '');
      setContent(editingNote?.content ?? '');
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 150);
    }
  }, [visible, editingNote]);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const newErrors: { title?: string; content?: string } = {};

    if (!trimmedTitle) newErrors.title = 'Title cannot be empty.';
    if (!trimmedContent) newErrors.content = 'Content cannot be empty.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      if (isEdit) {
        await editLeadNote({
          id: editingNote.id,
          title: trimmedTitle,
          content: trimmedContent,
        });
      } else {
        await addLeadNote({
          lead: lead_id,
          title: trimmedTitle,
          content: trimmedContent,
        });
      }

      onClose();
    } catch {
      setErrors({ content: 'Something went wrong. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.modalSheet}>
          {/* Drag handle */}
          <View style={styles.sheetHandle} />

          {/* Modal header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {isEdit ? 'Edit Note' : 'Add Note'}
            </Text>
            <TouchableOpacity style={styles.sheetClose} onPress={onClose}>
              <Feather name="x" size={18} color={DS.color.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Title input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Title <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.textInputWrapper,
                !!errors.title && styles.textAreaError,
              ]}
            >
              <TextInput
                ref={titleRef}
                value={title}
                onChangeText={(v) => {
                  setTitle(v);
                  if (errors.title)
                    setErrors((e) => ({ ...e, title: undefined }));
                }}
                placeholder="Note title…"
                placeholderTextColor={DS.color.textMuted}
                returnKeyType="next"
                onSubmitEditing={() => inputRef.current?.focus()}
                style={styles.textInput}
              />
            </View>
            {!!errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Content input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Content <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View
              style={[
                styles.textAreaWrapper,
                !!errors.content && styles.textAreaError,
              ]}
            >
              <TextInput
                ref={inputRef}
                value={content}
                onChangeText={(v) => {
                  setContent(v);
                  if (errors.content)
                    setErrors((e) => ({ ...e, content: undefined }));
                }}
                placeholder="Write your note here…"
                placeholderTextColor={DS.color.textMuted}
                multiline
                style={styles.textArea}
                textAlignVertical="top"
              />
            </View>
            {!!errors.content && (
              <Text style={styles.errorText}>{errors.content}</Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.sheetActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={DS.color.textInverse} />
              ) : (
                <Text style={styles.saveBtnText}>
                  {isEdit ? 'Save Changes' : 'Add Note'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* ─── Delete Confirm Modal ────────────────────────── */

interface DeleteConfirmModalProps {
  visible: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  visible,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View style={styles.confirmOverlay}>
      <View style={styles.confirmCard}>
        <View style={styles.confirmIconWrap}>
          <Feather name="trash-2" size={24} color={DS.color.danger} />
        </View>

        <Text style={styles.confirmTitle}>Delete Note?</Text>
        <Text style={styles.confirmMessage}>
          This note will be permanently removed and cannot be undone.
        </Text>

        <View style={styles.confirmActions}>
          <TouchableOpacity
            style={styles.confirmCancel}
            onPress={onCancel}
            disabled={isDeleting}
          >
            <Text style={styles.confirmCancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmDelete, isDeleting && styles.saveBtnDisabled]}
            onPress={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={DS.color.textInverse} />
            ) : (
              <Text style={styles.confirmDeleteText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

/* ─── Empty State ─────────────────────────────────── */

const EmptyState = () => (
  <View style={styles.empty}>
    <View style={styles.emptyIconWrap}>
      <Feather name="file-text" size={28} color={DS.color.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No Notes Found</Text>
    <Text style={styles.emptyDesc}>Lead notes will appear here.</Text>
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  // NOTE FORM MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modalSheet: {
    backgroundColor: DS.color.card,
    borderTopLeftRadius: DS.radius.xl,
    borderTopRightRadius: DS.radius.xl,
    paddingHorizontal: DS.spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 36 : DS.spacing.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: DS.color.border,
    ...DS.shadow.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.color.border,
    alignSelf: 'center',
    marginTop: DS.spacing.md,
    marginBottom: DS.spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DS.spacing.xl,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.color.bg,
    borderWidth: 1,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: DS.spacing.xl,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DS.color.textSecondary,
    letterSpacing: 0.5,
    marginBottom: DS.spacing.sm,
  },
  requiredStar: {
    color: DS.color.danger,
  },
  textInputWrapper: {
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.bg,
    paddingHorizontal: DS.spacing.md,
    height: 50,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: DS.color.textPrimary,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.bg,
    paddingHorizontal: DS.spacing.md,
    paddingVertical: DS.spacing.md,
    minHeight: 120,
  },
  textAreaError: {
    borderColor: DS.color.danger,
    backgroundColor: DS.color.dangerLight,
  },
  textArea: {
    fontSize: 14,
    color: DS.color.textPrimary,
    lineHeight: 22,
    minHeight: 100,
  },
  errorText: {
    marginTop: DS.spacing.xs,
    fontSize: 12,
    color: DS.color.danger,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: 50,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...DS.shadow.sm,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textInverse,
  },

  // DELETE CONFIRM MODAL
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.xxl,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.xxl,
    alignItems: 'center',
    ...DS.shadow.md,
  },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DS.spacing.lg,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DS.color.textPrimary,
    marginBottom: DS.spacing.sm,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 13,
    color: DS.color.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
    marginTop: DS.spacing.xl,
    width: '100%',
  },
  confirmCancel: {
    flex: 1,
    height: 44,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textSecondary,
  },
  confirmDelete: {
    flex: 1,
    height: 44,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmDeleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textInverse,
  },
});
