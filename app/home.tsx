import { Text, View } from 'react-native';
import { CustomerCard } from '../components/CustomerCard';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1EFE8',
      }}
    >
      <Text style={{ fontSize: 48 }}></Text>
      <CustomerCard />
    </View>
  );
}
