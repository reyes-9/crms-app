import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ReusableModal } from '@/components/ReusableModal';
import { useUser } from '@/hooks/useUser';
import { DS } from '@/theme/design';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.sectionCard}>{children}</View>
);

const SectionTitle = ({ label }: { label: string }) => (
  <Text style={styles.sectionLabel}>{label}</Text>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null | undefined;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconBox}>
      <Feather name={icon as any} size={14} color={DS.color.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const RoleBadge = ({ role }: { role: string }) => {
  const config: Record<string, { bg: string; color: string }> = {
    admin: { bg: DS.color.primaryLight, color: DS.color.primary },
    vendor: { bg: DS.color.warningLight, color: DS.color.warning },
    user: { bg: DS.color.neutralLight, color: DS.color.neutral },
  };
  const cfg = config[role] ?? config.user;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
    </View>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; color: string; dot: string }> = {
    active: {
      bg: DS.color.successLight,
      color: DS.color.success,
      dot: DS.color.success,
    },
    inactive: {
      bg: DS.color.neutralLight,
      color: DS.color.neutral,
      dot: DS.color.neutral,
    },
    suspended: {
      bg: DS.color.dangerLight,
      color: DS.color.danger,
      dot: DS.color.danger,
    },
  };
  const cfg = config[status] ?? config.inactive;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

// ─── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: ChangePasswordPayload) => Promise<void>;
  loading: boolean;
}) {
  const [form, setForm] = useState<ChangePasswordPayload>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }
    await onSubmit(form);
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Pressable onPress={handleClose} style={styles.modalCloseBtn}>
              <Feather name="x" size={18} color={DS.color.textSecondary} />
            </Pressable>
          </View>

          {/* Fields */}
          {(
            [
              {
                key: 'currentPassword',
                label: 'Current password',
                show: showCurrent,
                toggle: () => setShowCurrent((p) => !p),
              },
              {
                key: 'newPassword',
                label: 'New password',
                show: showNew,
                toggle: () => setShowNew((p) => !p),
              },
              {
                key: 'confirmPassword',
                label: 'Confirm password',
                show: showConfirm,
                toggle: () => setShowConfirm((p) => !p),
              },
            ] as const
          ).map(({ key, label, show, toggle }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{label}</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={!show}
                  placeholder="••••••••"
                  placeholderTextColor={DS.color.textMuted}
                  value={form[key]}
                  onChangeText={(val) =>
                    setForm((prev) => ({ ...prev, [key]: val }))
                  }
                  autoCapitalize="none"
                />
                <Pressable onPress={toggle} style={styles.inputEye}>
                  <Feather
                    name={show ? 'eye-off' : 'eye'}
                    size={16}
                    color={DS.color.textMuted}
                  />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Submit */}
          <Pressable
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={DS.color.textInverse} />
            ) : (
              <Text style={styles.submitButtonText}>Update Password</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Action Row ───────────────────────────────────────────────────────────────

function ActionRow({
  icon,
  label,
  onPress,
  destructive = false,
  loading = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  loading?: boolean;
}) {
  const color = destructive ? DS.color.danger : DS.color.textPrimary;
  const bg = destructive ? DS.color.dangerLight : DS.color.primaryMuted;
  const iconColor = destructive ? DS.color.danger : DS.color.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionRow,
        pressed && styles.actionRowPressed,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.actionIconBox, { backgroundColor: bg }]}>
        {loading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Feather name={icon as any} size={15} color={iconColor} />
        )}
      </View>
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      {!loading && (
        <Feather name="chevron-right" size={16} color={DS.color.textMuted} />
      )}
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const tabBarHeight = useBottomTabBarHeight();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const account = user?.account_details;

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    'No name set';
  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase() || '?';

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    try {
      setChangingPassword(true);
      // await userService.changePassword(payload);
      Alert.alert('Success', 'Password updated successfully.');
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to update password.',
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      // await reportService.generate();
      Alert.alert(
        'Report Generated',
        'Your report has been generated and will be sent to your email.',
      );
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to generate report.',
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutModalVisible(false);
      navigation.replace('Login');
    } catch (err: any) {
      setLogoutModalVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.response?.data?.message ?? 'Please try again later',
      });
    }
  };

  return (
    <>
      <ReusableModal
        state="danger"
        visible={logoutModalVisible}
        title="You sure you want to log out?"
        // message="This record will be restored."
        buttons={[
          {
            label: 'Cancel',
            onPress: () => setLogoutModalVisible(false),
            variant: 'neutral',
          },
          {
            label: 'Logout',
            variant: 'danger',
            onPress: handleLogout,
          },
        ]}
        onClose={() => setLogoutModalVisible(false)}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: tabBarHeight + DS.spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PAGE HEADER ──────────────────── */}
        <View style={styles.pageHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>CRM</Text>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSubtitle}>
              Manage your account and preferences
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather name="user" size={18} color={DS.color.primary} />
          </View>
        </View>

        {/* ── AVATAR CARD ──────────────────── */}
        <SectionCard>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.avatarName}>{fullName}</Text>
              <Text style={styles.avatarEmail}>{user?.email || '—'}</Text>
              <View style={styles.avatarBadges}>
                {account?.role && <RoleBadge role={account.role} />}
                {account?.status && <StatusBadge status={account.status} />}
              </View>
            </View>
          </View>
        </SectionCard>

        {/* ── USER INFO ────────────────────── */}
        <SectionTitle label="USER INFO" />
        <SectionCard>
          <InfoRow icon="user" label="First name" value={user?.first_name} />
          <Divider />
          <InfoRow icon="user" label="Last name" value={user?.last_name} />
          <Divider />
          <InfoRow icon="mail" label="Email" value={user?.email} />
          <Divider />
          <InfoRow icon="phone" label="Phone" value={user?.phone_number} />
          <Divider />
          <InfoRow icon="map-pin" label="Address" value={user?.address} />
        </SectionCard>

        {/* ── ACCOUNT INFO ─────────────────── */}
        <SectionTitle label="ACCOUNT INFO" />
        <SectionCard>
          <InfoRow icon="at-sign" label="Username" value={user?.username} />
          <Divider />
          <InfoRow icon="shield" label="Role" value={user?.role} />
          <Divider />
          <InfoRow icon="activity" label="Status" value={user?.status} />
          <Divider />
          {/* <InfoRow
            icon="clock"
            label="Last login"
            value={
              account?.last_login
                ? new Date(account.last_login).toLocaleString()
                : null
            }
          /> */}
        </SectionCard>

        {/* ── ACTIONS ──────────────────────── */}
        <SectionTitle label="ACTIONS" />
        <SectionCard>
          <ActionRow
            icon="lock"
            label="Change Password"
            onPress={() => setPasswordModalVisible(true)}
          />
          <Divider />
          <ActionRow
            icon="file-text"
            label="Generate Report"
            onPress={handleGenerateReport}
            loading={generatingReport}
          />
          <Divider />
          <ActionRow
            icon="log-out"
            label="Log Out"
            onPress={() => {
              setLogoutModalVisible(true);
            }}
            destructive
          />
        </SectionCard>
      </ScrollView>

      {/* ── CHANGE PASSWORD MODAL ─────────── */}
      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        onSubmit={handleChangePassword}
        loading={changingPassword}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DS.color.bg,
  },
  container: {
    padding: DS.spacing.lg,
    gap: DS.spacing.sm,
  },

  // PAGE HEADER
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DS.spacing.md,
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

  // SECTION
  sectionLabel: {
    ...DS.typography.eyebrow,
    marginTop: DS.spacing.sm,
    marginBottom: DS.spacing.xs,
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    ...DS.shadow.sm,
  },
  divider: {
    height: 1,
    backgroundColor: DS.color.borderLight,
    marginLeft: DS.spacing.lg + 32 + DS.spacing.md, // align with text, not icon
  },

  // AVATAR
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DS.spacing.lg,
    gap: DS.spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.primaryLight,
    borderWidth: 2,
    borderColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: DS.color.primary,
  },
  avatarInfo: {
    flex: 1,
    gap: 2,
  },
  avatarName: {
    ...DS.typography.cardTitle,
  },
  avatarEmail: {
    fontSize: 13,
    color: DS.color.textSecondary,
    marginBottom: DS.spacing.sm,
  },
  avatarBadges: {
    flexDirection: 'row',
    gap: DS.spacing.sm,
  },

  // BADGE
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: DS.spacing.sm,
    borderRadius: DS.radius.full,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: DS.radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // INFO ROW
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
    paddingHorizontal: DS.spacing.lg,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.color.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: DS.color.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: DS.color.textPrimary,
    marginTop: 1,
  },

  // ACTION ROW
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.spacing.md,
    paddingVertical: DS.spacing.md,
    paddingHorizontal: DS.spacing.lg,
  },
  actionRowPressed: {
    backgroundColor: DS.color.borderLight,
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: DS.color.card,
    borderTopLeftRadius: DS.radius.xl,
    borderTopRightRadius: DS.radius.xl,
    padding: DS.spacing.lg,
    paddingBottom: DS.spacing.xxxl,
    gap: DS.spacing.md,
    ...DS.shadow.md,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.border,
    alignSelf: 'center',
    marginBottom: DS.spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DS.spacing.xs,
  },
  modalTitle: {
    ...DS.typography.sectionTitle,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // INPUT
  inputGroup: {
    gap: DS.spacing.xs,
  },
  inputLabel: {
    ...DS.typography.label,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.bg,
    paddingHorizontal: DS.spacing.md,
  },
  textInput: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: DS.color.textPrimary,
  },
  inputEye: {
    padding: DS.spacing.sm,
  },

  // SUBMIT
  submitButton: {
    height: 52,
    borderRadius: DS.radius.md,
    backgroundColor: DS.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.spacing.xs,
    ...DS.shadow.sm,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.color.textInverse,
  },
});
