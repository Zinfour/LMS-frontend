import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import useGetModuleById from '@/hooks/useGetModuleById';
import useCreateModule from '@/hooks/useCreateModule';
import useUpdateModule from '@/hooks/useUpdateModule';
import useDeleteModule from '@/hooks/useDeleteModule';

interface Props {
  courseId: number;
  userId: string;
  moduleId?: number;
}

const formSchema = z.object({
  name: z.string().trim().min(1, 'This field is required.').max(100),
  description: z.string().trim(),
  startDate: z.string().min(1, 'This field is required.'),
  endDate: z.string().min(1, 'This field is required.'),
  imageURL: z.url('Please enter a valid URL.').or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const ModuleDialog = ({ courseId, userId, moduleId }: Props) => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const isEditing = moduleId !== undefined;
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const { data: module } = useGetModuleById({
    moduleId,
    courseId,
    userId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: module?.name ?? '',
      description: module?.description ?? '',
      startDate: module?.startDate ?? '',
      endDate: module?.endDate ?? '',
      imageURL: module?.imageURL ?? '',
    },
  });

  const isPending = createModule.isPending || updateModule.isPending;
  const isError = createModule.isError || updateModule.isError;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen) {
      form.reset({
        name: module?.name ?? '',
        description: module?.description ?? '',
        startDate: module?.startDate ?? '',
        endDate: module?.endDate ?? '',
        imageURL: module?.imageURL ?? '',
      });
    } else {
      form.reset();
      createModule.reset();
      updateModule.reset();
    }
  };

  const handleDeleteOpenChange = (newOpen: boolean) => {
    setDeleteOpen(newOpen);

    if (!newOpen) {
      setConfirmation('');
      deleteModule.reset();
    }
  };

  const handleDelete = () => {
    if (moduleId === undefined || confirmation !== 'DELETE' || deleteModule.isPending) {
      return;
    }

    deleteModule.mutate(
      { courseId, moduleId, userId },
      {
        onSuccess: () => {
          handleDeleteOpenChange(false);
          setOpen(false);
        },
      },
    );
  };

  const handleFormSubmit = (values: FormValues) => {
    if (isEditing && module) {
      updateModule.mutate(
        {
          id: module.id,
          createdAt: module.createdAt,
          courseId: module.courseId,
          userId,
          ...values,
        },
        {
          onSuccess: () => {
            form.reset();
            setOpen(false);
          },
        },
      );

      return;
    }

    createModule.mutate(
      {
        courseId,
        userId,
        ...values,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
        ) : (
          <Button variant="outline">Add module</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit module' : 'Add module'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <div>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...form.register('name')} />
              <FieldError errors={[form.formState.errors.name]} />
            </div>

            <div>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" {...form.register('description')} />
              <FieldError errors={[form.formState.errors.description]} />
            </div>

            <div>
              <FieldLabel htmlFor="startDate">Start date</FieldLabel>
              <Input id="startDate" type="date" {...form.register('startDate')} />
              <FieldError errors={[form.formState.errors.startDate]} />
            </div>

            <div>
              <FieldLabel htmlFor="endDate">End date</FieldLabel>
              <Input id="endDate" type="date" {...form.register('endDate')} />
              <FieldError errors={[form.formState.errors.endDate]} />
            </div>

            <div>
              <FieldLabel htmlFor="imageURL">Image URL</FieldLabel>
              <Input id="imageURL" {...form.register('imageURL')} />
              <FieldError errors={[form.formState.errors.imageURL]} />
            </div>
          </FieldGroup>

          {isError && (
            <p className="mt-4 text-sm text-destructive">
              Failed to {isEditing ? 'update' : 'create'} module.
            </p>
          )}

          <DialogFooter className={isEditing ? 'mt-6 sm:grid sm:grid-cols-3 sm:items-center' : 'mt-6'}>
            {isEditing && (
              <AlertDialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
                <AlertDialogTrigger
                  render={
                    <Button type="button" variant="destructive" disabled={!module} className="sm:justify-self-start">
                      Delete module
                    </Button>
                  }
                />
                <AlertDialogContent
                  className="bg-card-foreground text-card shadow-xl"
                  overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete module?</AlertDialogTitle>
                    <AlertDialogDescription className="text-card/70">
                      This will permanently delete "{module?.name}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div>
                    <FieldLabel htmlFor="delete-confirmation">Type DELETE to confirm.</FieldLabel>
                    <Input
                      id="delete-confirmation"
                      value={confirmation}
                      onChange={(event) => setConfirmation(event.target.value)}
                    />
                  </div>

                  {deleteModule.isError && (
                    <p className="text-sm text-destructive">Failed to delete module.</p>
                  )}

                  <AlertDialogFooter className="bg-card-foreground">
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      variant="destructive"
                      disabled={confirmation !== 'DELETE' || deleteModule.isPending}
                      onClick={handleDelete}>
                      {deleteModule.isPending ? 'Deleting...' : 'Delete module'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <DialogClose className={isEditing ? 'sm:justify-self-center' : undefined}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending} className={isEditing ? 'sm:justify-self-end' : undefined}>
              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save changes'
                  : 'Create module'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
