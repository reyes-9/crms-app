import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

export const CustomerCard = () => {
  return (
    <View>
      <LinearGradient
        colors={['#10765c', '#0e634d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View
          style={{
            // backgroundColor: '#0F6E56',
            padding: 16,
            borderRadius: 13,
          }}
        >
          <View
            style={{
              width: 250,
              height: 250,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto',
            }}
          >
            <MaterialIcons
              name="person"
              size={150}
              color="#F1EFE8"
              style={
                {
                  // borderColor: '#F1EFE8',
                  // borderRadius: 50,
                }
              }
            />
          </View>

          <View style={{ gap: 5, marginTop: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <MaterialIcons
                name="person"
                size={20}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: '#F1EFE8', fontWeight: 'bold', fontSize: 20 }}
              >
                Nelson Reyes
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="business"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>
                Boundless Ideas I.T. Solutions
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="phone"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>09929440796</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="email"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>
                reyes.nelson.panong@gmail.com
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15, // same as border-radius: 50px
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10, // Android shadow
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
