import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { Alert, Button, Platform, Text, View } from 'react-native';

function showAlert(message: string) {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert(message);
  }
}

export const ProfileScreen = () => {
  const { logout } = useUser();

  const router = useRouter();

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button
        title="Login"
        onPress={() => {
          router.push('/login');
        }}
      />
      <Button
        title="logout"
        onPress={ async () => {
          await logout();
          router.replace('/login');
        }}
      />
    </View>
  );
};
