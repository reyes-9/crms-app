import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchInputProps {
  onSearch: (query: string) => void;
  delay?: number;
}

export const SearchInput = ({ onSearch, delay = 400 }: SearchInputProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
      console.log(value);
    }, delay); // use prop

    return () => clearTimeout(timer); // correct cleanup
  }, [value, delay]);

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Search"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F9FAFB', // softer, near-white
    borderRadius: 14,

    paddingHorizontal: 14,
    height: 48,

    borderWidth: 1,
    borderColor: '#E5E7EB', // subtle border

    // subtle shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // elevation (Android)
    elevation: 2,
  },

  icon: {
    marginRight: 10,
    opacity: 0.7, // softer icon tone
  },

  input: {
    flex: 1,
    fontSize: 15, // slightly refined
    color: '#111827',

    paddingVertical: 0, // prevent weird vertical stretching
  },
});

export default SearchInput;
