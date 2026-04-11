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
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Feather name="user" size={28} color="#fff" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.row}>
            <Feather name="briefcase" size={16} color="#6B7280" />
            <Text style={styles.text}>{company}</Text>
          </View>

          <View style={styles.row}>
            <Feather name="phone" size={16} color="#6B7280" />
            <Text style={styles.text}>{number}</Text>
          </View>

          <View style={styles.row}>
            <Feather name="mail" size={16} color="#6B7280" />
            <Text style={styles.text}>{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    // marginTop: 10,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    // borderRadius: 16,
    padding: 12,

    // Modern subtle shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.08,
    // shadowRadius: 10,
    // elevation: 3,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E9F6E', // modern green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 2,
  },

  text: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6B7280',
  },

  rightAction: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    // marginVertical: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    // marginTop: 4,
  },
});
