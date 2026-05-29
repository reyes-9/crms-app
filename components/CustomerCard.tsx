import { CustomerProfile } from '@/types/customer';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { DS } from '@/theme/design';

export const CustomerCard = ({
  name,
  company,
  email,
  number,
}: CustomerProfile) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={18} color={DS.color.primary} />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.company}>{company}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Feather name="phone" size={14} color={DS.color.textMuted} />
          <Text style={styles.text}>{number}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="mail" size={14} color={DS.color.textMuted} />
          <Text style={styles.text}>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    padding: DS.spacing.lg,
    marginBottom: DS.spacing.md,
    ...DS.shadow.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DS.spacing.md,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: DS.radius.full,
    backgroundColor: DS.color.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DS.spacing.md,
  },

  headerText: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },

  company: {
    marginTop: 2,
    fontSize: 12,
    color: DS.color.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: DS.color.borderLight,
    marginVertical: DS.spacing.sm,
  },

  section: {
    gap: DS.spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  text: {
    marginLeft: DS.spacing.sm,
    fontSize: 13,
    color: DS.color.textSecondary,
  },
});
