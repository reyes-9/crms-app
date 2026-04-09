import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/colors';

export const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback: navigate somewhere safe
      router.push('/app/home'); // or your default screen
    }
  };

  return (
    <SafeAreaView edges={['top', 'left']}>
      <TouchableOpacity
        onPress={handleBack}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10, // small spacing below safe area
          paddingLeft: 10,
          // position: 'absolute',
        }}
      >
        <Feather name="arrow-left" size={32} color="#1D9E75" />
        <Text style={{ color: theme.colors.primarySoft }}></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
