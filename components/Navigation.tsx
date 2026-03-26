import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboard Screen</Text>
    </View>
  );
}

function CustomerScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Customers</Text>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return (
                <MaterialIcons name="dashboard" size={size} color={color} />
              );
            case 'Customer':
              return <MaterialIcons name="people" size={size} color={color} />;
            case 'Notifications':
              return (
                <MaterialIcons name="notifications" size={size} color={color} />
              );
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#0F6E56', // active color
        tabBarInactiveTintColor: '#999', // inactive color
        tabBarStyle: { height: 70, paddingTop: 5 }, // recommended bottom nav height
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Customer" component={CustomerScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};
