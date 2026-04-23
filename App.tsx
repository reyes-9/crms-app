import { CustomerProvider } from '@/contexts/CustomerContext';
import { UserProvider } from '@/contexts/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { OrderProvider } from './contexts/OrderContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <UserProvider>
      <CustomerProvider>
        <OrderProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </OrderProvider>
      </CustomerProvider>
    </UserProvider>
  );
}
