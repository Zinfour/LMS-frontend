export type ActivityType = 'Seminar' | 'ELearning' | 'Practice' | 'Assignment' | 'Other';
export type ResourceType = 'instruction' | 'textmaterial' | 'link' | 'summary' | 'reference';
export type ModuleStatus = 'completed' | 'overdue' | 'inProgress' | 'locked';

export interface DatabaseUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  imageUrl: string;
  courseId: number;
}
