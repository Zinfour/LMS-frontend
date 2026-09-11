import React from 'react';
import useGetMyCourse from '@/hooks/useGetMyCourse';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import dayjs from 'dayjs';
import { Progress } from './ui/progress';
import { Link } from 'react-router';

export default function StudentProfileCourseInfoCards() {
  const { user } = usePersistentStore((state) => ({ user: state.user! }));
  const { data: myCourse, isLoading, error } = useGetMyCourse({ courseid: user.courseId, userId: user?.id });

  if (isLoading) {
    return (
      <React.Fragment>
        <Card className="flex items-center justify-center h-50">
          <CardContent>Loading...</CardContent>
        </Card>
        <Card className="flex items-center justify-center h-40">
          <CardContent>Loading...</CardContent>
        </Card>
      </React.Fragment>
    );
  }
  if (error || !myCourse) {
    return <></>;
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <CardTitle className="font-light text-muted-foreground text-xs">ENROLMENT</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            to={`/my-course`}
            className="no-underline hover:-translate-y-0.5 flex transition-transform duration-150">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 flex min-w-11 items-center justify-center bg-accent rounded-lg border-accent-foreground/20 border">
                <p className="text-accent-foreground text-xs font-semibold">
                  {myCourse.name.slice(0, 2).toUpperCase()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold line-clamp-3">{myCourse.name}</h3>
                <p className="text-muted-foreground font-light mt-1">
                  {dayjs(myCourse?.startDate).format('DD MMM')} - {dayjs(myCourse.endDate).format('DD MMM YYYY')}
                </p>
              </div>
            </div>
          </Link>
          <p className="text-muted-foreground text-sm mt-4 bg-accent rounded-lg border-accent-foreground/20 border px-2 py-2">
            A student belongs to exactly one course. Changing enrolment is done by the teacher —{' '}
            <span className="text-primary">
              <a href="about:blank" target="_blank" rel="noopener noreferrer">
                contact study administration.
              </a>
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-light text-muted-foreground text-xs">YOUR RESULTS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-light">Activities completed</p>
            <p className="font-semibold">
              {myCourse.userProgress.numberOfCompletedActivities} / {myCourse.userProgress.totalActivities}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-light">Submitted on time</p>
            <p className="font-semibold text-success-foreground">
              {myCourse.userProgress.numberOfCompletedActivities - myCourse.userProgress.numberOfOverdueActivities} of{' '}
              {myCourse.userProgress.numberOfCompletedActivities}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-light">Late submissions</p>
            <p className="font-semibold text-destructive">{myCourse.userProgress.numberOfOverdueActivities}</p>
          </div>
          <Progress className="scale-y-200 mt-3 mb-2" value={myCourse.userProgress.progressPercentage} />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
