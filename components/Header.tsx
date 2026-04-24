import { theme } from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Header = ({ title }: { title: string }) => {
  const route = useRoute();

  const titles: Record<string, string> = {
    Main: 'Dashboard',
    Profile: 'User Profile',
    CustomerList: 'Customers',
    ArchiveView: 'Archived Records',
  };

  console.log(title);

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={styles.container}>
        <View>
          <Feather name="menu" size={28} color="#333" />
        </View>
        <View>
          <Text style={styles.appName}>{title}</Text>
        </View>
        <View>
          <Feather name="bell" size={24} color="#333" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'none',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
  },
});
