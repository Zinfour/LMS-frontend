import { api } from '@/api';
import type { ResourceType, ModuleStatus, DatabaseUser } from '@/types';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export interface Course {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL: string;
  resources: Resource[];
  modules: Module[];
  students: DatabaseUser[];
  teacher: DatabaseUser;
}

export interface Resource {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
  url: string;
  resourceType: ResourceType;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageURL: string;
  courseId: number;
  activitiesNumber: number;
  resourcesNumber: number;
  numberOfCompletedActivities: number;
  order: number;
  currentStatus: ModuleStatus;
}

const useGetMyCourse = ({ courseid, userId }: { courseid: number; userId?: number }) => {
  return useQuery({
    queryKey: ['myCourse', userId, courseid],
    queryFn: async () => {
      const response = await api.get<Course>(`/courses/${courseid}`);

      const [totalActivities, numberOfCompletedActivities, numberOfOverdueActivities] = response.data.modules.reduce(
        ([total, completed, overdue], module) => [
          total + module.activitiesNumber,
          completed + module.numberOfCompletedActivities,
          overdue + (module.currentStatus === 'overdue' ? 1 : 0),
        ],
        [0, 0, 0],
      );
      const courseProgress =
        totalActivities > 0 ? Math.round((numberOfCompletedActivities / totalActivities) * 100) : 0;

      let courseStatus: 'in-progress' | 'completed' | 'not-started' = 'in-progress';
      if (dayjs().isAfter(dayjs(response.data.endDate))) {
        courseStatus = 'completed';
      } else if (dayjs().isBefore(dayjs(response.data.startDate))) {
        courseStatus = 'not-started';
      }

      const parsedCourseData = {
        ...response.data,
        status: courseStatus,
        currentModuleId: response.data.modules.find((module) => module.currentStatus === 'inProgress')?.id ?? null,
        userProgress: {
          totalActivities,
          numberOfCompletedActivities,
          progressPercentage: courseProgress,
          numberOfOverdueActivities, // This will only increase by 1 per module that is overdue (So not really counting every overdue activity, but rather the number of modules that are overdue)
        },
      };

      return parsedCourseData;
    },
    retry: 3,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 10, // 10 minutes cache
    enabled: !!userId, // Only run the query if userId is provided
  });
};

export default useGetMyCourse;
