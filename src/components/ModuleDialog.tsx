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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import useGetModuleById from '@/hooks/useGetModuleById';
import useCreateModule from '@/hooks/useCreateModule';
import useUpdateModule from '@/hooks/useUpdateModule';

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
  const isEditing = moduleId !== undefined;
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
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

          <DialogFooter className="mt-6">
            <DialogClose>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
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
