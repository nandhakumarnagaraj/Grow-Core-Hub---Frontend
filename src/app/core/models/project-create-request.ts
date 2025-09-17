import { ProjectType } from "./project-type";

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  statementOfWork?: string;
  projectType: ProjectType;
  minScore: number;
  payoutAmount: number;
  billingCycleDays: number;
  durationDays?: number;
  crmProvided?: boolean;
  crmUrl?: string;
}
