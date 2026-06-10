import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { CustomerScreen } from '@/screens/Customer/CustomerScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import { LeadScreen } from '@/screens/Lead/LeadScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { DS } from '@/theme/design';
import { Pressable } from 'react-native';

const Tab = createBottomTabNavigator();

/* ─── Tab config ─────────────────────────────────── */

const TABS = [
  { name: 'Dashboard', icon: 'grid', label: 'Dashboard' },
  { name: 'Customer', icon: 'users', label: 'Customers' },
  { name: 'Leads', icon: 'file-text', label: 'Leads' },
  { name: 'Profile', icon: 'user', label: 'Profile' },
] as const;

/* ─── Custom Tab Bar ─────────────────────────────── */

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View
              key={route.key}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? tab.label}
            >
              {/* Pill indicator behind icon+label */}
              {isFocused && <View style={styles.activePill} />}

              {/* Pressable sits on top */}
              <Pressable style={styles.tabInner} onPress={onPress}>
                <Feather
                  name={tab.icon as any}
                  size={20}
                  color={isFocused ? DS.color.primary : DS.color.textMuted}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* ─── Navigator ──────────────────────────────────── */

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} isReturn={false} />,
        sceneStyle: {
          backgroundColor: DS.color.bg,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Customer" component={CustomerScreen} />
      <Tab.Screen name="Leads" component={LeadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/* ─── Styles ─────────────────────────────────────── */

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: DS.spacing.lg,
    backgroundColor: 'transparent',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: DS.color.card,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.color.border,
    paddingVertical: DS.spacing.sm,
    paddingHorizontal: DS.spacing.sm,
    ...DS.shadow.md,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 52,
  },

  activePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
    borderRadius: DS.radius.lg,
    backgroundColor: DS.color.primaryMuted,
  },

  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    zIndex: 1,
    paddingHorizontal: DS.spacing.xs,
    paddingVertical: DS.spacing.md,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  tabLabelActive: {
    color: DS.color.primary,
  },

  tabLabelInactive: {
    color: DS.color.textMuted,
  },
});
