export type User = {
  id: string;
  email: string;
  lastLogin: string | undefined;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  lastLogin: string | null;
};
