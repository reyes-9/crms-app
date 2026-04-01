export interface UserProviderProps {
  children: React.ReactNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserCreadentials {
  email: string;
  password: string;
}

export interface UserContextType {
  user: UserDetails | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}
