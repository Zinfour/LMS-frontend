import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import type { DatabaseUser, ResourceType } from '@/types';

export interface ModuleDetails {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL: string;
  courseId: number;
  totalNumberOfModules: number;
  order: number;
  activities: Activity[];
  resources: ModuleResource[];
}

export interface Activity {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  imageURL: string;
  moduleId: number;
  completed: boolean;
  assignment: ActivityAssignment;
  resources: ActivityResource[];
}

interface Resource {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  url: string;
  resourceType: ResourceType;
}

interface ModuleResource extends Resource {
  name: string;
  description: string;
  moduleId: number;
}

interface ActivityResource extends Resource {
  activityId: number;
}

interface ActivityAssignment {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  deadline: string;
  activityId: number;
  submissions: Submission[];
}

interface Submission {
  id: number;
  createdAt: string;
  text: string;
  overdue: boolean;
  studentId: string;
  assignmentId: number;
  feedback: Feedback[];
}

interface Feedback {
  id: number;
  createdAt: string;
  text: string;
  teacherId: string;
  teacher: DatabaseUser;
}

const useGetModuleById = ({ moduleId, userId, courseId }: { moduleId?: number; userId?: number; courseId: number }) => {
  return useQuery({
    queryKey: ['module', moduleId, userId],
    queryFn: async () => {
      const response = await api.get<ModuleDetails>(`/courses/${courseId}/modules/${moduleId}`);

      const numberOfCompltedActivities = response.data.activities.filter((activity) => activity.completed).length;
      const moduleProgress = Math.round((numberOfCompltedActivities / response.data.activities.length) * 100);

      const parsedModule = {
        ...response.data,
        numberOfCompletedActivities: numberOfCompltedActivities,
        numberOfActivities: response.data.activities.length,
        moduleProgress: moduleProgress,
        currentActivityId: response.data.activities.find((activity) => !activity.completed)?.id ?? null,
        idOfCurrentActivity: response.data.activities.find((activity) => !activity.completed)?.id ?? null,
      };

      return parsedModule;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId && !!moduleId, // Only run the query if userId is provided
  });
};

export default useGetModuleById;
