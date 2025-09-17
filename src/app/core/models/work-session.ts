import { SessionStatus } from "./session-status";

export interface WorkSession {
  id: number;
  projectId: number;
  projectTitle?: string;
  startTime: Date;
  endTime?: Date;
  hours?: number;
  notes?: string;
  status: SessionStatus;
}
