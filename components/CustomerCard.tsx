import { DS } from '@/theme/design';
import { CustomerProfile } from '@/types/customer';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export const CustomerCard = ({
  name,
  company,
  email,
  number,
}: CustomerProfile) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          {!!company && (
            <Text numberOfLines={1} style={styles.company}>
              {company}
            </Text>
          )}
        </View>

        <Feather name="chevron-right" size={16} color={DS.color.textMuted} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="phone" size={12} color={DS.color.textMuted} />
          <Text numberOfLines={1} style={styles.metaText}>
            {number}
          </Text>
        </View>

        <View style={styles.dot} />

        <View style={styles.metaItem}>
          <Feather name="mail" size={12} color={DS.color.textMuted} />
          <Text numberOfLines={1} style={styles.metaText}>
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: DS.color.card,
    borderWidth: 1,
    borderColor: DS.color.border,
    borderRadius: DS.radius.lg,
    padding: DS.spacing.md,
    marginBottom: DS.spacing.sm,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DS.color.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: DS.color.primary,
  },

  info: {
    flex: 1,
    marginLeft: DS.spacing.md,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DS.spacing.sm,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: DS.color.textMuted,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.color.border,
    marginHorizontal: 8,
  },
});
