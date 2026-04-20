import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';

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
    backgroundColor: '#e3e3e3', // light gray background
    borderRadius: 12,
    paddingHorizontal: 12,
    // paddingVertical: 2,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827', // dark text
  },
});

export default SearchInput;
