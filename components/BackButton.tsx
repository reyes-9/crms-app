import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/colors';

export const BackButton = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
    // if (navigation.canGoBack()) {
    //   navigation.goBack();
    // } else {
    //   // fallback screen (update to your actual route name)
    //   // navigation.navigate('Main' as never);
    // }
  };

  return (
    <SafeAreaView edges={['top', 'left']}>
      <TouchableOpacity
        onPress={handleBack}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10,
          paddingLeft: 10,
        }}
      >
        <Feather name="arrow-left" size={32} color="#1D9E75" />
        <Text style={{ color: theme.colors.primarySoft }} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
