import { Education } from './education';
import { Skill } from './skill';

export interface ProfileUpdateRequest {
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
  skills: Skill[];
  education: Education[];
  documents: Document[];
}
