// FIX THE API RESPOJNSES
// FIX THE API RESPOJNSES
// FIX THE API RESPOJNSES

// THE ADVANCEMENT IS NOT YET COMPLETE
// THE ADVANCEMENT IS NOT YET COMPLETE
// THE ADVANCEMENT IS NOT YET COMPLETE

// COMPLETE THE EDIT LEAD
// COMPLETE THE EDIT LEAD
// COMPLETE THE EDIT LEAD

import { ReusableModal } from '@/components/ReusableModal';
import { useLead } from '@/hooks/useLead';
import { DS } from '@/theme/design';
import { LeadStatus } from '@/types/lead';
import { RootStackParamList } from '@/types/navigation';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

type LeadDetailsRoute = RouteProp<RootStackParamList, 'LeadDetails'>;

/* ─── Constants ──────────────────────────────────── */

export const STATUS_COLOR: Record<LeadStatus, { bg: string; color: string }> = {
  new: { bg: '#DBEAFE', color: '#1D4ED8' },
  contacted: { bg: '#FEF3C7', color: '#B45309' },
  qualified: { bg: '#DCFCE7', color: '#15803D' },
  unqualified: { bg: '#FEE2E2', color: '#B91C1C' },
  converted: { bg: '#ECFDF5', color: '#047857' },
  lost: { bg: '#F1F5F9', color: '#475569' },
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  unqualified: 'Unqualified',
  converted: 'Converted',
  lost: 'Lost',
};

const STATUS_CHOICES: [LeadStatus, string][] = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['qualified', 'Qualified'],
  ['converted', 'Converted'],
];

const ADVANCE_MAP: Record<LeadStatus, LeadStatus | null> = {
  new: 'contacted',
  contacted: 'qualified',
  qualified: 'converted',
  converted: null,
  unqualified: null,
  lost: null,
};

/* ═══════════════════════════════════════════════════
   LEAD DETAILS SCREEN
═══════════════════════════════════════════════════ */

export const LeadDetailsScreen = () => {
  const route = useRoute<LeadDetailsRoute>();
  const navigation = useNavigation<any>();

  const { leads, advanceLead, deleteLead, archiveLead } = useLead(); // ← pull leads array

  const { lead: routeLead } = route.params;

  // ✅ Correctly derives from leads array — updates whenever useLead state changes
  const lead = useMemo(
    () => leads.find((l) => l.id === routeLead.id) ?? routeLead,
    [leads, routeLead.id],
  );

  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [advanceModalVisible, setAdvanceModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const currentStatus = lead.status as LeadStatus;
  const currentIndex = STATUS_CHOICES.findIndex(([v]) => v === currentStatus);
  const nextStatus = ADVANCE_MAP[currentStatus];
  const canAdvance = nextStatus != null;

  const initials = lead.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();

  /* ── Actions ────────────────────────────────────── */

  const confirmAdvance = async () => {
    if (!nextStatus) return;
    try {
      setAdvanceLoading(true);
      await advanceLead(lead.id, nextStatus);
      Toast.show({
        type: 'success',
        text1: 'Lead Advanced',
        text2: `Lead moved to ${STATUS_LABEL[nextStatus]}`,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to advance lead',
      });
    } finally {
      setAdvanceLoading(false);
      setAdvanceModalVisible(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteLead(lead.id);
      setDeleteVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Lead Deleted',
        text2: 'Lead deleted successfully',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to delete lead',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmArchive = async () => {
    try {
      setActionLoading(true);
      await archiveLead(lead.id);
      setArchiveVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Lead Archived',
        text2: 'Lead archived successfully',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Failed to archive lead',
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Render ─────────────────────────────────────── */

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROFILE CARD ─────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{lead.name}</Text>
            {lead.company ? (
              <Text style={styles.profileCompany}>{lead.company}</Text>
            ) : null}
            <View style={styles.profileMeta}>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: STATUS_COLOR[currentStatus]?.bg },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    { color: STATUS_COLOR[currentStatus]?.color },
                  ]}
                >
                  {STATUS_LABEL[currentStatus] ?? currentStatus}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('LeadForm', { mode: 'edit', lead })
            }
          >
            <Feather name="edit-2" size={14} color={DS.color.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── QUICK ACTIONS ─────────────────────── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Linking.openURL(`tel:${lead.number}`)}
          >
            <Feather name="phone" size={16} color={DS.color.primary} />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Linking.openURL(`mailto:${lead.email}`)}
          >
            <Feather name="mail" size={16} color={DS.color.primary} />
            <Text style={styles.actionBtnText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.actionBtnPrimary,
              !canAdvance && styles.actionBtnDisabled,
            ]}
            onPress={() => setAdvanceModalVisible(true)}
            disabled={!canAdvance || advanceLoading}
          >
            {advanceLoading ? (
              <ActivityIndicator size="small" color={DS.color.textInverse} />
            ) : (
              <>
                <Feather
                  name="arrow-right-circle"
                  size={16}
                  color={DS.color.textInverse}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    { color: DS.color.textInverse },
                  ]}
                >
                  {canAdvance ? STATUS_LABEL[nextStatus!] : 'Advance Lead'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── PIPELINE ─────────────────────────── */}
        <SectionCard title="Pipeline Stage" icon="git-branch">
          <View style={styles.pipeline}>
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
                    styles.pipelineStage,
                    isPassed && styles.stagePassed,
                    isCurrent && styles.stageCurrent,
                    isFailed && styles.stageFailed,
                    isUpcoming && styles.stageUpcoming,
                    !isLast && styles.stageNotLast,
                  ]}
                >
                  <Text
                    style={[
                      styles.stageText,
                      isPassed && styles.stagePassedText,
                      isCurrent && styles.stageCurrentText,
                      isFailed && styles.stageFailedText,
                      isUpcoming && styles.stageUpcomingText,
                    ]}
                  >
                    {text}
                  </Text>
                </View>
              );
            })}
          </View>
        </SectionCard>

        {/* ── LEAD INFO ────────────────────────── */}
        <SectionCard title="Lead Info" icon="user">
          {[
            { label: 'Email', value: lead.email },
            { label: 'Phone', value: lead.number },
            { label: 'Company', value: lead.company ?? '—' },
            {
              label: 'Status',
              value: STATUS_LABEL[currentStatus] ?? currentStatus,
            },
            {
              label: 'Source',
              value: lead.source.charAt(0).toUpperCase() + lead.source.slice(1),
            },
          ].map(({ label, value }, i) => (
            <View key={label}>
              {i > 0 && <View style={styles.rowDivider} />}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        {/* ── NOTES ────────────────────────────── */}
        {lead.notes ? (
          <SectionCard title="Notes" icon="file-text">
            <Text style={styles.notesText}>{lead.notes}</Text>
          </SectionCard>
        ) : null}

        {/* ── DANGER ZONE ──────────────────────── */}
        <SectionCard title="Actions" icon="tool">
          <View style={styles.dangerRow}>
            {/* <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() => setArchiveVisible(true)}
            >
              <Feather name="archive" size={15} color={DS.color.warning} />
              <View style={styles.dangerBtnText}>
                <Text style={styles.dangerBtnTitle}>Archive Lead</Text>
                <Text style={styles.dangerBtnSub}>
                  Hide from active leads list
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={DS.color.textMuted}
              />
            </TouchableOpacity> */}

            {/* <View style={styles.rowDivider} /> */}

            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() => setDeleteVisible(true)}
            >
              <Feather name="trash-2" size={15} color={DS.color.danger} />
              <View style={styles.dangerBtnText}>
                <Text
                  style={[styles.dangerBtnTitle, { color: DS.color.danger }]}
                >
                  Delete Lead
                </Text>
                <Text style={styles.dangerBtnSub}>
                  Permanently remove this lead
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={DS.color.textMuted}
              />
            </TouchableOpacity>
          </View>
        </SectionCard>
      </ScrollView>

      {/* ── ADVANCE CONFIRM ──────────────────────── */}
      <ReusableModal
        state="success"
        visible={advanceModalVisible}
        title="Advance Lead"
        message={`Move this lead to "${nextStatus ? STATUS_LABEL[nextStatus] : ''}"? This cannot be undone.`}
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setAdvanceModalVisible(false),
            variant: 'neutral',
          },
          { label: 'Advance', onPress: confirmAdvance, variant: 'success' },
        ]}
        onClose={() => setAdvanceModalVisible(false)}
      />

      {/* ── ARCHIVE CONFIRM ──────────────────────── */}
      <ReusableModal
        visible={archiveVisible}
        onClose={() => setArchiveVisible(false)}
        title="Archive Lead?"
        state="warning"
        message="This lead will be hidden from your active leads list. You can restore it later."
        buttons={[
          {
            label: 'Cancel',
            variant: 'neutral',
            onPress: () => setArchiveVisible(false),
          },
          {
            label: actionLoading ? 'Archiving...' : 'Archive',
            variant: 'warning',
            onPress: handleConfirmArchive,
          },
        ]}
      />

      {/* ── DELETE CONFIRM ───────────────────────── */}
      <ReusableModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        title="Delete Lead?"
        state="danger"
        message="This lead will be permanently removed and cannot be undone."
        buttons={[
          {
            label: 'Cancel',
            variant: 'neutral',
            onPress: () => setDeleteVisible(false),
          },
          {
            label: actionLoading ? 'Deleting...' : 'Delete',
            variant: 'danger',
            onPress: handleConfirmDelete,
          },
        ]}
      />
    </>
  );
};
/* ─── Section Card ────────────────────────────────── */

const SectionCard = ({
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
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionIconWrap}>
          <Feather name={icon} size={13} color={DS.color.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.sectionAction} onPress={onAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <Feather name="chevron-right" size={13} color={DS.color.primary} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

/* ─── Confirm Modal ───────────────────────────────── */

interface ConfirmModalProps {
  visible: boolean;
  isLoading: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
  iconBg: string;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// const ConfirmModal = ({
//   visible,
//   isLoading,
//   icon,
//   iconColor,
//   iconBg,
//   title,
//   message,
//   confirmLabel,
//   confirmColor,
//   onConfirm,
//   onCancel,
// }: ConfirmModalProps) => (
//   <Modal visible={visible} animationType="fade" transparent>
//     <View style={styles.confirmOverlay}>
//       <View style={styles.confirmCard}>
//         <View style={[styles.confirmIconWrap, { backgroundColor: iconBg }]}>
//           <Feather name={icon} size={24} color={iconColor} />
//         </View>
//         <Text style={styles.confirmTitle}>{title}</Text>
//         <Text style={styles.confirmMessage}>{message}</Text>
//         <View style={styles.confirmActions}>
//           <TouchableOpacity
//             style={styles.confirmCancel}
//             onPress={onCancel}
//             disabled={isLoading}
//           >
//             <Text style={styles.confirmCancelText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.confirmAction,
//               { backgroundColor: confirmColor },
//               isLoading && styles.confirmActionDisabled,
//             ]}
//             onPress={onConfirm}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="small" color={DS.color.textInverse} />
//             ) : (
//               <Text style={styles.confirmActionText}>{confirmLabel}</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>
// );

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DS.color.bg },
  content: { padding: DS.spacing.xl, gap: DS.spacing.md, paddingBottom: 40 },

  // PROFILE CARD
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

  // ACTIONS ROW
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
    flex: 1.6,
  },
  actionBtnDisabled: {
    backgroundColor: DS.color.border,
    borderColor: DS.color.border,
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

  // INFO ROWS
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

  // NOTES
  notesText: {
    fontSize: 14,
    lineHeight: 22,
    color: DS.color.textSecondary,
  },

  // DANGER ZONE
  dangerRow: { gap: 0 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
  },
  dangerBtnText: { flex: 1 },
  dangerBtnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.warning,
  },
  dangerBtnSub: {
    fontSize: 12,
    color: DS.color.textMuted,
    marginTop: 2,
  },

  // CONFIRM MODAL
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
  confirmAction: {
    flex: 1,
    height: 44,
    borderRadius: DS.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmActionDisabled: { opacity: 0.6 },
  confirmActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.color.textInverse,
  },
});
