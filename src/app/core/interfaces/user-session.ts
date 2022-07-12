export interface UserSession {
  id: number;
  noEmployee: string;
  fullName: string;
  email: string;
  token: string;
  role: Role;
}

interface Role {
  id: number;
  name: string;
}
