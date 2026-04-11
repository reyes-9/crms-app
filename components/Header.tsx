import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

export const Header = () => {
  return (
    <View style={styles.container}>
      <View>
        <Feather name="menu" size={28} color="#333" />
      </View>
      <View>
        <Text style={styles.appName}>Locus</Text>
      </View>
      <View>
        <Feather name="bell" size={24} color="#333" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'none',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
  },
});
