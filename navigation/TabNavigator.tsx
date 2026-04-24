import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CustomerScreen } from '@/screens/CustomerScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { LeadsScreen } from '@/screens/LeadsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { theme } from '@/theme/colors';
import { View } from 'react-native';

import { Header } from '@/components/Header';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
      <View style={{ flex: 1 }}>
        <Header title={'Locus'} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
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
                default:
                  return null;
              }
            },
            tabBarActiveTintColor: theme.colors.tabActive,
            tabBarInactiveTintColor: theme.colors.tabInactive,
            tabBarStyle: {
              height: 70,
              paddingTop: 5,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen
            name="Customer"
            component={CustomerScreen}
            options={{ tabBarBadge: 5 }}
          />
          <Tab.Screen name="Leads" component={LeadsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
  );
};
