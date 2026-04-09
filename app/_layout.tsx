import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { CustomerProvider } from '../contexts/CustomerContext';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,
    InterBold: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or a splash screen
  }

  return (
    <UserProvider>
      <CustomerProvider>
        {/* <SafeAreaProvider> */}
        <Stack screenOptions={{ headerShown: false }} />
        {/* </SafeAreaProvider> */}
      </CustomerProvider>
    </UserProvider>
  );
}
