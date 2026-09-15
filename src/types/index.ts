export type ActivityType = 'Seminar' | 'ELearning' | 'Practice' | 'Assignment' | 'Other';
export type ResourceType = 'Instruction' | 'TextMaterial' | 'Link' | 'Summary' | 'Reference';
export type ModuleStatus = 'completed' | 'overdue' | 'inProgress' | 'locked';
export type UserRole = 'teacher' | 'student';

export interface DatabaseUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Teacher' | 'Student';
  imageUrl: string;
  courseId: number;
}
