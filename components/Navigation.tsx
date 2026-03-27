import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomerScreen } from '../screens/CustomerScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LeadsScreen } from '../screens/LeadsScreen';

const Tab = createBottomTabNavigator();

export const Navigation = () => {
  return (
    <Tab.Navigator
      // @ts-ignore
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return (
                <MaterialIcons name="dashboard" size={size} color={color} />
              );
            case 'Customer':
              return <MaterialIcons name="people" size={size} color={color} />;
            case 'Leads':
              return (
                <MaterialIcons name="assignment" size={size} color={color} />
              );
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#0F6E56', // active color
        tabBarInactiveTintColor: '#999', // inactive color
        tabBarStyle: [{ height: 70, paddingTop: 5 }], // recommended bottom nav height
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
    </Tab.Navigator>
  );
};
