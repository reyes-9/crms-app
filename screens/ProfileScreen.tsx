// CREATE INTERFACES FOR CUSTOMERS ( customer.d.ts )
// CREATE SERVICE ( customerService.ts )  contains the code that talks to the api
// CREATE CONTEXT ( CustomerContext.tsx )  contains the code that manages the data recieved from the api
// CREATE HOOK ( useCustomer.tsx )  contains the code that enables the screen to use the functions inside the CONTEXT (CustomerContext.tsx)

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { Alert, Button, Platform, Text, View } from 'react-native';

// function showAlert(message: string) {
//   if (Platform.OS === 'web') {
//     window.alert(message);
//   } else {
//     Alert.alert(message);
//   }
// }

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
        onPress={async () => {
          await logout();
          router.replace('/login');
        }}
      />
    </View>
  );
};
