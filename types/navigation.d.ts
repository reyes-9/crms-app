import { ParamListBase } from '@react-navigation/native';
import { CustomerProfile } from './customer';

export type RootStackParamList = ParamListBase & {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  CustomerDetails: {
    customer: CustomerProfile;
  };
  EditCustomer: {
    customer: CustomerProfile;
  };
};
