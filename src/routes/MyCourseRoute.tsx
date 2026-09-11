import { Routes, Route, useParams } from 'react-router';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import useGetActivityById from '@/hooks/useGetActivityById';
import MyCourse from '@/screens/MyCourse/index';
import Module from '@/screens/MyCourse/Module';
import Activity from '@/screens/MyCourse/Activity';
import BreadCrumbsLayout from '@/components/BreadCrumbsLayout';
import useGetModuleById from '@/hooks/useGetModuleById';

const breadCrumbsConfig = [
  { path: '/my-course', crumb: () => 'My Course' },
  { path: '/my-course/:moduleId', crumb: () => <ModuleCrumb /> },
  { path: '/my-course/:moduleId/:activityId', crumb: () => <ActivityCrumb /> },
];

const ModuleCrumb = () => {
  const user = usePersistentStore((state) => state.user!);
  const { moduleId } = useParams();
  const { data: module } = useGetModuleById({ moduleId: Number(moduleId), courseId: user.courseId, userId: user?.id });

  return module?.name ?? 'Module';
};

const ActivityCrumb = () => {
  const user = usePersistentStore((state) => state.user);
  const { activityId } = useParams();
  const { data } = useGetActivityById({ activityId: Number(activityId), userId: user?.id });
  return data?.name ?? 'Activity';
};

export default function MyCourseRoute() {
  return (
    <Routes>
      <Route element={<BreadCrumbsLayout routes={breadCrumbsConfig} />}>
        <Route path="/" element={<MyCourse />} />
        <Route path=":moduleId" element={<Module />} />
        <Route path=":moduleId/:activityId" element={<Activity />} />
      </Route>
    </Routes>
  );
}
