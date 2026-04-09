import { Header } from '@/components/Header';
import { View } from 'react-native';
import { Navigation } from '../../components/Navigation';

export default function AppLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Navigation />
    </View>
  );
}

// // App.tsx (entry point)
// import { NavigationContainer } from '@react-navigation/native';
// import { View } from 'react-native';
// import { Header } from '../../components/Header';
// import { Navigation } from '../../components/Navigation';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <View style={{ flex: 1 }}>
//         <Header />
//         <Navigation />
//       </View>
//     </NavigationContainer>
//   );
// }
