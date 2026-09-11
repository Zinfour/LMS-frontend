import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from './ui/button';

export default function ProfileDelete() {
  const handleDelete = () => {
    console.log('Delete clicked');
  };
  return (
    <Card className="border-destructive/50 border">
      <CardHeader>
        <CardTitle className="font-semibold text-destructive">Delete Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-light">
          Removes your profile and all submissions. This cannot be undone and requires confirmation.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="px-4 py-5 w-full mt-4">
                Remove
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your account? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <AlertDialogAction className="flex-1" onClick={handleDelete} variant="destructive">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
