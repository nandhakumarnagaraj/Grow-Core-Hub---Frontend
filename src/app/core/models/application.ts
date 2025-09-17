import { ApplicationStatus } from "./application-status";

export interface Application {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  projectId: number;
  projectTitle?: string;
  assessmentId?: number;
  status: ApplicationStatus;
  signedAgreementAt?: Date;
  createdAt: Date;
}
