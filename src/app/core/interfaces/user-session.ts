export interface UserSession {
  id: number;
  fullName: string;
  email: string;
  personalPhone: string;
  role: Role;
  token: string;
}

interface Role {
  id: number;
  name: string;
}
