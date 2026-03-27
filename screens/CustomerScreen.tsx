import { CustomerCard } from '@/components/CustomerCard';
import React, { useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';

export const CustomerScreen = () => {
  const [customers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      company: 'Acme Corp',
      number: '123-456-7890',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      company: 'Globex Inc',
      number: '987-654-3210',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      company: 'Initech',
      number: '555-111-2222',
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana@example.com',
      company: 'Wayne Enterprises',
      number: '444-333-2222',
    },
    {
      id: 5,
      name: 'Ethan Hunt',
      email: 'ethan@example.com',
      company: 'Impossible Missions Force',
      number: '999-888-7777',
    },
    {
      id: 6,
      name: 'Fiona Gallagher',
      email: 'fiona@example.com',
      company: 'Gallagher Group',
      number: '222-333-4444',
    },
    {
      id: 7,
      name: 'George Clooney',
      email: 'george@example.com',
      company: 'Ocean Enterprises',
      number: '111-222-3333',
    },
    {
      id: 8,
      name: 'Hannah Montana',
      email: 'hannah@example.com',
      company: 'Star Records',
      number: '777-666-5555',
    },
    {
      id: 9,
      name: 'Ian Malcolm',
      email: 'ian@example.com',
      company: 'Jurassic Labs',
      number: '888-999-0000',
    },
    {
      id: 10,
      name: 'Julia Roberts',
      email: 'julia@example.com',
      company: 'Hollywood Productions',
      number: '333-444-5555',
    },
  ]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View>
      {/* {customers.map((customer) => (
          <CustomerCard
            name={customer.name}
            email={customer.email}
            company={customer.company}
            number={customer.number}
          />
        ))} */}

      <FlatList
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomerCard
            name={item.name}
            email={item.email}
            company={item.company}
            number={item.number}
          />
        )}
      />
    </View>
  );
};
