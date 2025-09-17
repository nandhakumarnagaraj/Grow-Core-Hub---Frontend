import { UserRole } from "./user-role";
import { UserStatus } from "./userstatus";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
