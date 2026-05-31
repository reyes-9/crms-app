import { ParamListBase } from '@react-navigation/native';
import { CustomerProfile } from './customer';

export type RootStackParamList = ParamListBase & {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Customer: {};
  CustomerForm: {}
  CustomerDetails: {
    customer: CustomerProfile;
  };
  EditCustomer: {
    customer: CustomerProfile;
  };

  Orders: { customer_id: number };

  OrderFormScreen:
    | { mode: 'create'; customerId: number }
    | { mode: 'edit'; orderId: number };

  CustomerNotes: { customer_id: number };
};
