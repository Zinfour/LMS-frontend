import type { StudentOverviewData, TeacherOverviewData } from './overview.types';
import { studentOverviewMock, teacherOverviewMock } from './overview.mock';

// Using mock data for now. Connect the real backend data here later.
// Overview UI can stay the same.

export function useStudentOverview(): { data: StudentOverviewData; isLoading: boolean } {
  return { data: studentOverviewMock, isLoading: false };
}

export function useTeacherOverview(): { data: TeacherOverviewData; isLoading: boolean } {
  return { data: teacherOverviewMock, isLoading: false };
}
