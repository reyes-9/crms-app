import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CustomerScreen } from '@/screens/CustomerScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { LeadsScreen } from '@/screens/LeadsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { theme } from '@/theme/colors';

import { Header } from '@/components/Header';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} isReturn={false} />,

        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },

        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return <Feather name="grid" size={size} color={color} />;
            case 'Customer':
              return <Feather name="users" size={size} color={color} />;
            case 'Leads':
              return <Feather name="file-text" size={size} color={color} />;
            case 'Profile':
              return <Feather name="user" size={size} color={color} />;
          }
        },

        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          header: () => <Header title="Dashboard" isReturn={false} />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Customer"
        component={CustomerScreen}
        options={{
          header: () => <Header title="Customer" isReturn={false} />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Leads"
        component={LeadsScreen}
        options={{
          header: () => <Header title="Leads" isReturn={false} />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: () => <Header title="Profile" isReturn={false} />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
