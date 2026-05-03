export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    roles: string[];
  };
};
