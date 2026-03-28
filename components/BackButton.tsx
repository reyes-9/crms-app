import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity
      onPress={handleBack}
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <MaterialIcons name="arrow-back" size={24} color="#1D9E75" />
      <Text style={{ color: theme.colors.primarySoft}}>Return</Text>
    </TouchableOpacity>
  );
};
