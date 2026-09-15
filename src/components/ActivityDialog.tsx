import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Activity } from '@/hooks/useGetModuleById';
import type { ActivityType } from '@/types';
import useCreateActivity from '@/hooks/useCreateActivity';
import useUpdateActivity from '@/hooks/useUpdateActivity';

interface Props {
  moduleId: number;
  activity?: Activity;
}

const formSchema = z.object({
  type: z.enum(['Seminar', 'ELearning', 'Practice', 'Assignment', 'Other']),
  name: z.string().trim().min(1, 'Name is required.'),
  startTime: z.string().min(1, 'Start time is required.'),
  endTime: z.string().min(1, 'End time is required.'),
  description: z.string().trim().min(1, 'Description is required.'),
  imageURL: z.url('Please enter a valid URL.').or(z.literal('')),
  assignmentDeadline: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const activityTypes: { label: string; value: ActivityType }[] = [
  { label: 'Seminar', value: 'Seminar' },
  { label: 'E-learning', value: 'ELearning' },
  { label: 'Practice', value: 'Practice' },
  { label: 'Assignment', value: 'Assignment' },
  { label: 'Other', value: 'Other' },
];

const Form = ({ moduleId, activity, setDialogOpen }: Props & { setDialogOpen: (open: boolean) => void }) => {
  const isEditing = activity !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      type: activity?.type ?? 'Seminar',
      name: activity?.name ?? '',
      startTime: activity?.startTime ?? '',
      endTime: activity?.endTime ?? '',
      description: activity?.description ?? '',
      imageURL: activity?.imageURL ?? '',
      assignmentDeadline: activity?.assignment?.deadline ?? '',
    },
  });

  const activityType = useWatch({
    control: form.control,
    name: 'type',
  });

  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();

  const isPending = createActivity.isPending || updateActivity.isPending;
  const error = createActivity.error || updateActivity.error;
  const formId = isEditing ? `edit-activity-form-${activity.id}` : 'create-activity-form';

  const errorMessage = axios.isAxiosError(error)
    ? typeof error.response?.data === 'string'
      ? error.response.data
      : 'Something went wrong.'
    : 'Something went wrong.';

  const handleFormSubmit = (data: FormValues) => {
    if (isEditing) {
      updateActivity.mutate(
        {
          moduleId,
          activity,
          type: data.type,
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          description: data.description,
          imageURL: data.imageURL || undefined,
          assignmentDeadline: data.type === 'Assignment' ? data.assignmentDeadline : undefined,
        },
        {
          onSuccess: () => {
            form.reset();
            setDialogOpen(false);
          },
        },
      );

      return;
    }

    createActivity.mutate(
      {
        moduleId,
        type: data.type,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        description: data.description,
        imageURL: data.imageURL || undefined,
        assignmentDeadline: data.type === 'Assignment' ? data.assignmentDeadline : undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          setDialogOpen(false);
        },
      },
    );
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit activity' : 'Add activity'}</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="activity-type">Type</FieldLabel>
                <Select
                  items={activityTypes}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={isPending}>
                  <SelectTrigger id="activity-type">
                    <SelectValue>{activityTypes.find((item) => item.value === field.value)?.label}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Activity types</SelectLabel>
                      {activityTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="activity-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="activity-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Activity name"
                  autoComplete="off"
                  disabled={isPending}
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <FieldGroup className="grid grid-cols-2 gap-4">
            <Controller
              name="startTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="activity-start">Start time</FieldLabel>
                  <Input
                    {...field}
                    id="activity-start"
                    type="datetime-local"
                    className="dark:scheme-dark"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="endTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="activity-end">End time</FieldLabel>
                  <Input
                    {...field}
                    id="activity-end"
                    type="datetime-local"
                    className="dark:scheme-dark"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="activity-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="activity-description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Describe the activity..."
                  className="h-32 resize-y"
                  disabled={isPending}
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="imageURL"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="activity-image">Image URL</FieldLabel>
                <Input
                  {...field}
                  id="activity-image"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com/image.jpg"
                  autoComplete="off"
                  type="url"
                  disabled={isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {activityType === 'Assignment' && (
            <Controller
              name="assignmentDeadline"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="assignment-deadline">Deadline</FieldLabel>
                  <Input
                    {...field}
                    id="assignment-deadline"
                    type="datetime-local"
                    className="dark:scheme-dark"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}
        </FieldGroup>

        {error && <p className="mt-4 text-sm text-destructive">{errorMessage}</p>}

        <DialogFooter>
          <DialogClose
            className="flex-1 py-4"
            render={
              <Button type="button" variant="outline">
                Cancel
              </Button>
            }
          />
          <Button type="submit" form={formId} disabled={isPending} className="flex-1 py-4">
            {isEditing ? (isPending ? 'Saving...' : 'Save Changes') : isPending ? 'Creating...' : 'Create Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
};

export default function ActivityDialog({ moduleId, activity }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        render={
          activity ? (
            <Button type="button" variant="ghost" size="icon" aria-label="Edit activity">
              <Pencil />
            </Button>
          ) : (
            <Button variant="outline" className="w-fit">
              + Add activity
            </Button>
          )
        }
      />
      {dialogOpen && <Form moduleId={moduleId} activity={activity} setDialogOpen={setDialogOpen} />}
    </Dialog>
  );
}
