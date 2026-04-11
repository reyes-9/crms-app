import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

export const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const anim = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    anim.start(() => navigation.replace('Login'));

    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F6E56',
        opacity: fadeAnim,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/nexus_logo.png')}
          style={{ borderRadius: 12, width: 80, height: 80 }}
        />
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#F1EFE8' }}>
          Locus
        </Text>
        <Text style={{ fontSize: 24, color: '#F1EFE890' }}>CRM</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <Text style={{ fontSize: 18, color: '#F1EFE890' }}>
          Every relationship, perfectly in sync.
        </Text>
      </View>
    </Animated.View>
  );
};
