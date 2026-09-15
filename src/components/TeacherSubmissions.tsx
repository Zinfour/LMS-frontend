import { useParams } from 'react-router';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import useGetCourseById from '@/hooks/useGetCourseById';
import type { ActivityAssignment } from '@/hooks/useGetModuleById';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import UserImage from './UserImage';
import dayjs from 'dayjs';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import PlaceholderNotice from './PlaceholderNotice';

interface Props {
  assignment: ActivityAssignment;
}

export default function TeacherSubmissions({ assignment }: Props) {
  const { courseId } = useParams();
  const user = usePersistentStore((state) => state.user!);
  // get all users for this course
  const {
    data: course,
    isLoading: isCourseLoading,
    error: isCourseError,
  } = useGetCourseById({ courseid: Number(courseId), userId: user.id });

  if (isCourseLoading) {
    return <p>Loading...</p>;
  }
  if (isCourseError || !course) {
    return <p>Error loading course.</p>;
  }

  const allUsersForTheCourse = course.students;

  const usersMappedToSubmissions = allUsersForTheCourse.map((student) => {
    const submissionForUser = assignment.submissions?.find((submission) => submission.studentId === student.id);
    return {
      ...student,
      submission: submissionForUser,
      submitted: !!submissionForUser,
    };
  });

  console.log(usersMappedToSubmissions);
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col">
            {usersMappedToSubmissions.map((user, index) => (
              <li key={user.id}>
                <Dialog>
                  <DialogTrigger className="w-full" disabled={!user.submitted}>
                    <div className={cn(user.submitted ? 'opacity-100' : 'opacity-80')}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <UserImage username={user.firstName} imageURL={user.imageUrl}></UserImage>
                          <div className="flex flex-col items-start">
                            <p className={`font-semibold`}>
                              {user.firstName} {user.lastName}
                            </p>
                            <p className={`text-xs text-muted-foreground font-light`}>
                              {user.submitted
                                ? dayjs(user.submission?.createdAt).format('D MMM h:mm')
                                : 'Not submitted'}
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            user.submitted ? 'bg-success-foreground' : 'bg-muted-foreground',
                          )}></div>
                      </div>
                      {index !== usersMappedToSubmissions.length - 1 && <Separator className="h-px my-3" />}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="w-125 max-w-200! py-6">
                    <DialogHeader>
                      <DialogTitle>
                        <div className="flex items-center gap-2">
                          <UserImage username={user.firstName} imageURL={user.imageUrl}></UserImage>
                          <div className="flex flex-col items-start">
                            <p className={`font-semibold`}>
                              {user.firstName} {user.lastName}
                            </p>
                            <p className={`text-xs text-muted-foreground font-light`}>
                              {user.submitted
                                ? dayjs(user.submission?.createdAt).format('D MMM h:mm')
                                : 'Not submitted'}
                            </p>
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-2 max-h-80 overflow-y-auto bg-muted-foreground/10 px-4 pt-2 pb-4 rounded-lg">
                      <h1 className="text-lg font-semibold mb-2">Submitted answer:</h1>
                      <p className="leading-relaxed opacity-90">
                        {user.submitted ? user.submission?.text : 'No submission content available.'}
                      </p>
                    </div>
                    <div className="relative">
                      <h2 className="text-sm font-semibold mb-2 mt-2">Feedback to student:</h2>
                      <Textarea
                        className="resize-none pt-2 pb-8 px-2 min-h-30"
                        id="textarea-message"
                        placeholder="Type your feedback here."
                      />
                      <Button className="w-full py-5 mt-2">Send feedback</Button>
                      <PlaceholderNotice />
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
