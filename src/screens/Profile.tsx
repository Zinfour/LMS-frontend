import { Card, CardContent } from '@/components/ui/card';
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

export default function Profile() {
  const { user } = usePersistentStore((state) => ({ user: state.user! })); // Get the user from the store

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
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
        </CardContent>
      </Card>
    </div>
  );
}
