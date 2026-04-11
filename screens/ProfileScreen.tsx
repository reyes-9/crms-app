import { useUser } from '@/hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Text, View } from 'react-native';

// function showAlert(message: string) {
//   if (Platform.OS === 'web') {
//     window.alert(message);
//   } else {
//     Alert.alert(message);
//   }
// }
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

export const ProfileScreen = () => {
  const { logout } = useUser();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button
        title="Login"
        onPress={() => {
          navigation.push('Login');
        }}
      />
      <Button
        title="logout"
        onPress={async () => {
          await logout();
          navigation.replace('Login');
        }}
      />
    </View>
  );
};
