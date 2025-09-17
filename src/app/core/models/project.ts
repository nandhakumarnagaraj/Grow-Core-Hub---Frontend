import { ProjectStatus } from './project-status';
import { ProjectType } from './project-type';

export interface Project {
  id: number;
  title: string;
  description?: string;
  statementOfWork?: string;
  projectType: ProjectType;
  minScore: number;
  payoutAmount: number;
  billingCycleDays: number;
  durationDays?: number;
  crmProvided: boolean;
  status: ProjectStatus;
  createdAt: Date;
}
