import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';

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
    <TouchableOpacity
      onPress={handleBack}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 20,
      }}
    >
      <Feather name="arrow-left" size={18} color="#1D9E75" />
      <Text
        style={{
          marginLeft: 6,
          color: '#1D9E75',
          fontWeight: '500',
          fontSize: 14,
        }}
      >
        Back
      </Text>
    </TouchableOpacity>
  );
};
