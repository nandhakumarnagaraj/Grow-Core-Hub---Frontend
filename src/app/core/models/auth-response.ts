import { UserRole } from "./user-role";

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  message: string;
}
