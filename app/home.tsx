import { Text, View } from 'react-native';
import { CustomerCard } from '../components/CustomerCard';
import { Navigation } from '../components/Navigation';

export default function Index() {
  return (
    <View
      style={{
        flexGrow: 1,
        backgroundColor: '#F1EFE8',
      }}
    >
      <Text style={{ fontSize: 48 }}></Text>
      <Navigation />
    </View>
  );
}
