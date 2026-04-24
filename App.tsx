import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserProvider } from '@/contexts/UserContext';
import { NavigationContainer } from '@react-navigation/native';

import 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomerNoteProvider } from './contexts/CustomerNoteContext';
import { OrderProvider } from './contexts/OrderContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <UserProvider>
      <CustomerProvider>
        <OrderProvider>
          <CustomerNoteProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </CustomerNoteProvider>
        </OrderProvider>
      </CustomerProvider>
    </UserProvider>
  );
}
