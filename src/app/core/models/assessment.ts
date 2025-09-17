import { AssessmentStatus } from "./assessment-status";
import { AssessmentType } from "./assessment-type";
import { Question } from "./question";

export interface Assessment {
  id: number;
  projectId: number;
  projectTitle?: string;
  type: AssessmentType;
  questions: Question[];
  score?: number;
  status: AssessmentStatus;
  createdAt: Date;
  submittedAt?: Date;
}
