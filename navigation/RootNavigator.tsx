import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Header } from '@/components/Header';

import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { RegisterScreen } from '@/screens/Auth/RegisterScreen';
import { SplashScreen } from '@/screens/SplashScreen';

import { CustomerDetailsScreen } from '@/screens/Customer/CustomerDetailsScreen';
import { CustomerFormScreen } from '@/screens/Customer/CustomerFormScreen';
import { EditCustomerScreen } from '@/screens/Customer/EditCustomerScreen';

import { LeadDetailsScreen } from '@/screens/Lead/LeadDetailsScreen';
import { LeadFormScreen } from '@/screens/Lead/LeadFormScreen';

import { CustomerNotes } from '@/screens/Customer/CustomerNotes';
import { LeadNotes } from '@/screens/Lead/LeadNotes';
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
  { name: 'LeadDetails', component: LeadDetailsScreen, title: 'Lead Details' },
  { name: 'LeadForm', component: LeadFormScreen, title: 'Lead Form' },
  { name: 'Orders', component: OrdersScreen, title: 'Orders' },
  { name: 'OrderForm', component: OrderFormScreen, title: 'Order Form' },
  { name: 'CustomerNotes', component: CustomerNotes, title: 'Customer Notes' },
  { name: 'LeadNotes', component: LeadNotes, title: 'Lead Notes' },
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
      {/* AUTH */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* DETAIL SCREENS */}
      {DETAIL_SCREENS.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={({ navigation, route }) => ({
            headerShown: true,
            header: () => (
              <Header title={screen.title} isReturn={navigation.canGoBack()} />
            ),
          })}
        />
      ))}

      {/* MAIN APP */}
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
