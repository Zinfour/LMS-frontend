import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useGetMyCourse from '@/hooks/useGetMyCourse';
import { useStore } from '@/hooks/useStore';
import { Link } from 'react-router';

export default function MyCourse() {
  const user = useStore((state) => state.user);
  const { data: myCourse, isLoading, error } = useGetMyCourse({ userId: user?.id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {myCourse && (
        <div>
          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold">{myCourse.name}</h1>
            </CardHeader>
            <CardContent className="space-y-2 mt-4">
              <p>{myCourse.description}</p>
              <p>Teacher: {myCourse.teacher}</p>
            </CardContent>
          </Card>
          <Separator className="h-px my-8" />
          <h2 className="text-2xl font-bold mt-8 mb-4">Modules</h2>
          <ul className="flex gap-4">
            {myCourse.modules.map((module) => (
              <li className="hover:-translate-y-1 transition-transform" key={module.id}>
                <Link to={`${module.id}`}>
                  <Card>
                    <CardHeader>
                      <h4 className="text-lg font-bold">{module.name}</h4>
                    </CardHeader>
                    <CardContent className="space-y-2 mt-4">
                      <p>{module.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full py-4" variant="outline">
                        View More
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
