import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserProvider } from '@/contexts/UserContext';
import { NavigationContainer } from '@react-navigation/native';

import 'react-native-gesture-handler';

import { toastConfig } from '@/utils/toastConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
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
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootNavigator />
                </GestureHandlerRootView>
              </NavigationContainer>
              <Toast config={toastConfig} />
            </SafeAreaProvider>
          </CustomerNoteProvider>
        </OrderProvider>
      </CustomerProvider>
    </UserProvider>
  );
}
