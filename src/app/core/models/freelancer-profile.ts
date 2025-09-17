import { Education } from "./education";
import { Skill } from "./skill";
import { VerificationStatus } from "./verification-status";

export interface FreelancerProfile {
  userId: number;
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  skills: Skill[];
  education: Education[];
  documents: Document[];
  verificationStatus: VerificationStatus;
  rating?: number;
  completed: boolean;
}
