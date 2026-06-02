import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DS } from '@/theme/design';
import { BackButton } from './BackButton';

type HeaderProps = {
  title: string;
  isReturn: boolean;
};

export const Header = ({ title, isReturn }: HeaderProps) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        {/* LEFT */}
        <View style={styles.side}>
          {isReturn ? <BackButton /> : <Text style={styles.brand}>LOCUS</Text>}
        </View>

        {/* CENTER */}
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.side}>
          <Feather name="bell" size={18} color={DS.color.textSecondary} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: DS.color.card,
  },

  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.borderLight,
  },

  side: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: DS.color.primary,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.color.textPrimary,
  },
});
