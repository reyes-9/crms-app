import { ParamListBase } from '@react-navigation/native';

export type RootStackParamList = ParamListBase & {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  CustomerDetails: { customer_id: number };
};
