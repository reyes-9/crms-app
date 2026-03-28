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
    </View>
  );
};
