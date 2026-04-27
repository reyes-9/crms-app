import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity } from 'react-native';

export const BackButton = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handleBack}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'center',
        // IMPORTANT: force it to be a real touch region
        alignSelf: 'auto',
        zIndex: 10,
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
        pointerEvents="none"
      >
        Back
      </Text>
    </TouchableOpacity>
  );
};
