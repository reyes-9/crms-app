import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearKeys(keys: string[]) {
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}
// export async function clearKeys(keys: string[]) {
//   try {
//     await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
//   } catch (error) {
//     console.error('Error clearing keys:', error);
//     throw error; // optional: propagate if needed
//   }
// }
