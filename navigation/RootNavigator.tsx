import { Header } from '@/components/Header';
import { CustomerDetailsScreen } from '@/screens/CustomerDetailsScreen';
import { EditCustomerScreen } from '@/screens/EditCustomerScreen';
import { LeadDetailsScreen } from '@/screens/LeadDetailsScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'dark',
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetailsScreen}
        options={{
          headerShown: true,
          header: () => <Header title="CustomerDetails" isReturn={true} />,
        }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{
          headerShown: true,
          header: () => <Header title="EditCustomer" isReturn={true} />,
        }}
      />
      <Stack.Screen
        name="LeadDetails"
        component={LeadDetailsScreen}
        options={{
          headerShown: true,
          header: () => <Header title="LeadDetails" isReturn={true} />,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Orders" isReturn={true} />,
        }}
      />

      {/* <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={{
          headerShown: true,
          title: 'TEST HEADER',
        }}
      /> */}
      <Stack.Screen name="Main" component={TabNavigator} />
      {/* <Stack.Screen name="Customer" component={CustomerScreen} /> */}
    </Stack.Navigator>
  );
};
