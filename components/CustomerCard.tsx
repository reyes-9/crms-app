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
        {/* <View style={styles.avatar}>
          <Feather name="user" size={28} color="#fff" />
        </View> */}

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
    backgroundColor: '#FFFFFF',
    margin: 0,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',

    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    // padding: 14,
    // backgroundColor: '#fff',

    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E7EB',
    // borderColor: 'navy',

    // margin: 20,
    // backgroundColor: '#FFFFFF',
    // borderRadius: 16,

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
  },

  text: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6B7280',
  },
});
