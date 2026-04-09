import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomerProfile } from '@/types/customer';

export const CustomerCard = ({
  name,
  company,
  email,
  number,
}: CustomerProfile) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LinearGradient
        colors={['#10765c', '#0e634d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View
          style={{
            padding: 0,
            borderRadius: 13,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderEndWidth: 1,
            }}
          >
            <MaterialIcons
              name="person"
              size={80}
              color="#F1EFE8"
              style={
                {
                  // borderColor: '#F1EFE8',
                  // borderRadius: 50,
                }
              }
            />
          </View>

          <View style={{ gap: 5, flex: 2, paddingStart: 20 }}>
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
                {name}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="business"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>{company}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="phone"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>{number}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="email"
                size={18}
                color="#F1EFE8"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#F1EFE8' }}>{email}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    minHeight: 150,
    borderRadius: 15, // same as border-radius: 50px
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10, // Android boxShadow
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
