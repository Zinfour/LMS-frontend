import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserImage from '@/components/UserImage';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import PlaceholderNotice from '@/components/PlaceholderNotice';
import StudentProfileCourseInfoCards from '@/components/StudentProfileCourseInfoCards';
import ProfileDelete from '@/components/ProfileDelete';

export default function Profile() {
  const { user } = usePersistentStore((state) => ({ user: state.user! })); // Get the user from the store

  return (
    <div className="px-5 py-6 max-w-7xl w-full">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex gap-4 xl:gap-8 w-full ">
        <div className="flex-2">
          <Card>
            <CardContent>
              <div className="flex gap-4 items-center">
                <UserImage size="large" username={user.username} imageURL={user.imageURL} />
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      className="px-4 py-4 mr-2"
                      onClick={() => console.log('Change photo clicked')}>
                      Change photo
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button disabled={!user.imageURL} variant="destructive" className="px-4 py-4">
                            Remove
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove your profile photo? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => console.log('Continue clicked')} variant="destructive">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              <div className="relative">
                <PlaceholderNotice />
                <Field className="mt-8">
                  <FieldLabel className="mb-1 text-lg" htmlFor="textarea-message">
                    Short presentation
                  </FieldLabel>
                  <Textarea
                    className="resize-none pt-4 pb-8 px-4"
                    id="textarea-message"
                    placeholder="Type your message here."
                    value=":PLACEHOLDER: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. :PLACEHOLDER:"
                    onChange={(e) => console.log('Textarea changed:', e.target.value)}
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6 px-2 relative">
            <PlaceholderNotice />
            <CardHeader>
              <CardTitle className="font-semibold text-xl">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Deadline reminders</h3>
                  <p className="text-muted-foreground text-sm">Email 24h before an activity is due</p>
                </div>
                <div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator className="my-5 h-px" />
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">New feedback</h3>
                  <p className="text-muted-foreground text-sm">Notify me when a teacher reviews a hand-in</p>
                </div>
                <div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator className="my-5 h-px" />
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Weekly digest</h3>
                  <p className="text-muted-foreground text-sm">Monday summary of the week ahead</p>
                </div>
                <div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <StudentProfileCourseInfoCards />
          <ProfileDelete />
        </div>
      </div>
    </div>
  );
}
