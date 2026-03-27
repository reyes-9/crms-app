import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    }).start(async () => {
      // @ts-ignore
      router.replace('/home');
    });
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
}

const styles = StyleSheet.create({});
