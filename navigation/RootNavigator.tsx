import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Header } from '@/components/Header';

import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { SplashScreen } from '@/screens/SplashScreen';

import { CustomerDetailsScreen } from '@/screens/Customer/CustomerDetailsScreen';
import { CustomerFormScreen } from '@/screens/Customer/CustomerFormScreen';
import { EditCustomerScreen } from '@/screens/EditCustomerScreen';
import { LeadDetailsScreen } from '@/screens/LeadDetailsScreen';
import { CustomerNotes } from '@/screens/Notes/CustomerNotes';
import { OrderFormScreen } from '@/screens/Orders/OrderFormScreen';
import { OrdersScreen } from '@/screens/Orders/OrdersScreen';

import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

const DETAIL_SCREENS = [
  {
    name: 'CustomerDetails',
    component: CustomerDetailsScreen,
    title: 'Customer Details',
  },
  {
    name: 'EditCustomer',
    component: EditCustomerScreen,
    title: 'Edit Customer',
  },
  {
    name: 'LeadDetails',
    component: LeadDetailsScreen,
    title: 'Lead Details',
  },
  {
    name: 'Orders',
    component: OrdersScreen,
    title: 'Orders',
  },
  {
    name: 'OrderForm',
    component: OrderFormScreen,
    title: 'Order Form',
  },
  {
    name: 'CustomerNotes',
    component: CustomerNotes,
    title: 'Customer Notes',
  },
  {
    name: 'CustomerForm',
    component: CustomerFormScreen,
    title: 'Customer Form',
  },
] as const;

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

      {DETAIL_SCREENS.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            headerShown: true,
            header: () => <Header title={screen.title} isReturn={true} />,
          }}
        />
      ))}

      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
};
