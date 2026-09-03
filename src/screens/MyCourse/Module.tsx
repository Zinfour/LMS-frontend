import { useParams, Link } from 'react-router';
import useGetModuleById from '@/hooks/useGetModuleById';
import { useStore } from '@/hooks/useStore';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

export default function CourseModule() {
  const user = useStore((state) => state.user);
  const { moduleId } = useParams();
  const { data: module, isLoading, error } = useGetModuleById({ moduleId: Number(moduleId), userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {module && (
        <div>
          <h1 className="text-3xl font-bold mb-2">{module.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{module.description}</p>
          <Separator className="my-4 h-px" />
          <h2 className="text-2xl font-bold mt-4 mb-2">Activities</h2>
          <Card className="px-4 py-4">
            <ul className="flex flex-col gap-5">
              {module.activities.map((activity) => (
                <li className="hover:-translate-y-0.5 transition-transform duration-200" key={activity.id}>
                  <Link className="flex justify-between items-center" to={`${activity.id}`}>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{activity.name}</h3>
                      <p className="text-muted-foreground">{activity.description}</p>
                    </div>
                    <span>&gt;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
