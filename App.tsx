import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserProvider } from '@/contexts/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <UserProvider>
      <CustomerProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CustomerProvider>
    </UserProvider>
  );
}
