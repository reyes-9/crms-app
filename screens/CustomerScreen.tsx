import { CustomerCard } from '@/components/CustomerCard';
import { useCustomer } from '@/hooks/useCustomer';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';

export const CustomerScreen = () => {
  const { getCustomers, customers } = useCustomer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getCustomers(); // updates context state
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCustomers();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomerCard
            id={item.id}
            name={item.name}
            email={item.email}
            company={item.company}
            number={item.number}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No customers found</Text>
          </View>
        }
      />
    </View>
  );
};

// import { CustomerCard } from '@/components/CustomerCard';
// import { useCustomer } from '@/hooks/useCustomer';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
//   Text,
//   View,
// } from 'react-native';
// import { CustomerProfile } from '../types/customer';

// export const CustomerScreen = () => {
//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState<string | null>(null);
//   const [customers, setCustomers] = useState<CustomerProfile[]>([]);

//   const [refreshing, setRefreshing] = React.useState(false);

//   const { getCustomers, customer } = useCustomer();

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);

//   useEffect(() => {
//     // const displayCustomers = async () => {
//     //   getCustomers();
//     // };
//     getCustomers();
//     // displayCustomers();
//   }, []);
//   const isLoading = customers.length === 0;
//   useEffect(() => {
//     if (customer) {
//       setLoading(isLoading);
//       setCustomers([customer]);
//     }
//   }, [customer]);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }
//   if (error) {
//     // Show error message if something went wrong
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ color: 'red' }}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View>
//       <FlatList
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         data={customers}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <CustomerCard
//             id={item.id}
//             name={item.name}
//             email={item.email}
//             company={item.company}
//             number={item.number}
//           />
//         )}
//       />
//     </View>
//   );
// };
