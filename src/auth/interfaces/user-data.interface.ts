export interface UserData {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    balance?: number;
    currency?: string;
  };
  token: string;
}
