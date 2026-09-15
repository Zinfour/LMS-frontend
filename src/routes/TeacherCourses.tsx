import { Routes, Route, useParams } from 'react-router';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import useGetActivityById from '@/hooks/useGetActivityById';
import Module from '@/screens/MyCourse/Module';
import Activity from '@/screens/MyCourse/Activity';
import BreadCrumbsLayout from '@/components/BreadCrumbsLayout';
import useGetModuleById from '@/hooks/useGetModuleById';
import useGetCourseById from '@/hooks/useGetCourseById';
import Courses from '@/screens/Courses';
import Course from '@/screens/Course';

const breadCrumbsConfig = [
  { path: '/courses', crumb: () => 'Courses' },
  { path: '/courses/:courseId', crumb: () => <CourseCrumb /> },
  { path: '/courses/:courseId/:moduleId', crumb: () => <ModuleCrumb /> },
  { path: '/courses/:courseId/:moduleId/:activityId', crumb: () => <ActivityCrumb /> },
];

const CourseCrumb = () => {
  const { courseId } = useParams();
  const user = usePersistentStore((state) => state.user!);
  const { data: course } = useGetCourseById({ courseid: Number(courseId), userId: user?.id });

  return course?.name ?? 'Course';
};

const ModuleCrumb = () => {
  const user = usePersistentStore((state) => state.user!);
  const { courseId, moduleId } = useParams();
  const { data: module } = useGetModuleById({ moduleId: Number(moduleId), courseId: Number(courseId), userId: user?.id });

  return module?.name ?? 'Module';
};

const ActivityCrumb = () => {
  const user = usePersistentStore((state) => state.user);
  const { activityId } = useParams();
  const { data } = useGetActivityById({ activityId: Number(activityId), userId: user?.id });
  return data?.name ?? 'Activity';
};

export default function TeacherCoursesRoute() {
  return (
    <Routes>
      <Route element={<BreadCrumbsLayout routes={breadCrumbsConfig} />}>
        <Route path="/" element={<Courses />} />
        <Route path=":courseId" element={<Course />} />
        <Route path=":courseId/:moduleId" element={<Module />} />
        <Route path=":courseId/:moduleId/:activityId" element={<Activity />} />
      </Route>
    </Routes>
  );
}
