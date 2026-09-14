import { Button } from '@/components/ui/button';
import UserImage from '@/components/UserImage';
import { useState } from 'react';
import useUpdateProfilePhoto from '@/hooks/useUpdateProfilePhoto';
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
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError } from './ui/field';
import { Input } from './ui/input';

const schema = z.object({
  newImageURL: z.string().url(),
});

export default function ProfilePhotoHandler() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, setUser } = usePersistentStore((state) => ({ user: state.user!, setUser: state.setUser })); // Get the user from the store

  const profileUpdateSuccessCallback = (newImageUrl: string | undefined) => {
    setUser({
      ...user,
      imageURL: newImageUrl,
    });
    setIsFormOpen(false);
  };

  const { mutate: updateProfilePhoto, isPending } = useUpdateProfilePhoto(user.id, profileUpdateSuccessCallback);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newImageURL: '',
    },
  });

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    updateProfilePhoto(data.newImageURL);
  };

  return (
    <div>
      <div className="flex gap-4 items-center">
        <UserImage size="large" username={user.username} imageURL={user.imageURL} />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="mt-2">
            <Button
              disabled={isPending}
              variant="secondary"
              className="px-4 py-4 mr-2"
              onClick={() => setIsFormOpen(true)}>
              Change photo
            </Button>
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button disabled={!user.imageURL || isPending} variant="destructive" className="px-4 py-4">
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
                  <AlertDialogAction
                    onClick={() => {
                      updateProfilePhoto(undefined);
                      setDialogOpen(false);
                    }}
                    variant="destructive">
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {isFormOpen && (
        <form className="flex gap-2  mt-6" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Controller
            name="newImageURL"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                {/* <FieldLabel htmlFor="newImageURL">New Image URL</FieldLabel> */}
                <Input
                  {...field}
                  id="newImageURL"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com/new-image.jpg"
                  autoCapitalize="off"
                  autoComplete="off"
                  className="py-5"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" className="py-5" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Photo'}
          </Button>
        </form>
      )}
    </div>
  );
}
