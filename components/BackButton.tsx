import { MaterialIcons } from '@expo/vector-icons';
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
      router.push('/home'); // or your default screen
    }
  };

  return (
    <SafeAreaView edges={['top', 'left']}>
      <TouchableOpacity
        onPress={handleBack}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 8, // small spacing below safe area
          paddingLeft: 8,
          // position: 'absolute',
        }}
      >
        <MaterialIcons name="arrow-back" size={24} color="#1D9E75" />
        <Text style={{ color: theme.colors.primarySoft }}>Return</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
