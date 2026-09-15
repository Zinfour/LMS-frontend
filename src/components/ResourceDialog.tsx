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

import type { ActivityResource } from '@/hooks/useGetModuleById';
import type { ResourceType } from '@/types';
import useCreateActivityResource from '@/hooks/useCreateActivityResource';
import useUpdateActivityResource from '@/hooks/useUpdateActivityResource';

interface Props {
  activityId: number;
  resourceType: ResourceType;
  buttonText?: string;
  resource?: ActivityResource;
}

const formSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().min(1, 'This field is required.'),
  url: z.url('Please enter a valid URL.').or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResourceDialog({
  activityId,
  resourceType,
  buttonText,
  resource,
}: Props) {
  const [open, setOpen] = useState(false);

  const isEditing = resource !== undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: resource?.name ?? '',
      description: resource?.description ?? '',
      url: resource?.url ?? '',
    },
  });

  const createActivityResource = useCreateActivityResource();
  const updateActivityResource = useUpdateActivityResource();

  const isPending =
    createActivityResource.isPending ||
    updateActivityResource.isPending;

  const isError =
    createActivityResource.isError ||
    updateActivityResource.isError;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      form.reset({
        name: resource?.name ?? '',
        description: resource?.description ?? '',
        url: resource?.url ?? '',
      });
    } else {
      form.reset();
      createActivityResource.reset();
      updateActivityResource.reset();
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    if (isEditing) {
      updateActivityResource.mutate(
        {
          activityId,
          resource,
          name: values.name,
          description: values.description,
          url: values.url || undefined,
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

    createActivityResource.mutate(
      {
        activityId,
        resourceType,
        name: values.name,
        description: values.description,
        url: values.url || undefined,
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
      <DialogTrigger
        render={
          isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 bottom-1"
              aria-label="Edit resource"
            >
              <Pencil />
            </Button>
          ) : (
            <Button variant="outline" className="w-fit">
              {buttonText}
            </Button>
          )
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit ' : 'Add '}
            {resourceType === 'TextMaterial'
              ? 'text'
              : resourceType === 'Instruction'
                ? 'instructions'
                : 'link'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            {/* TextMaterial */}
            {resourceType === 'TextMaterial' && (
              <>
                <div className="space-y-2">
                  <FieldLabel htmlFor="text-title">
                    Title
                  </FieldLabel>

                  <Input
                    id="text-title"
                    {...form.register('name')}
                    placeholder="Title"
                    aria-invalid={!!form.formState.errors.name}
                  />

                  {form.formState.errors.name && (
                    <FieldError
                      errors={[form.formState.errors.name]}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="text-body">
                    Body
                  </FieldLabel>

                  <Textarea
                    id="text-body"
                    {...form.register('description')}
                    placeholder="Write your text here..."
                    className="h-96 resize-y"
                    aria-invalid={
                      !!form.formState.errors.description
                    }
                  />

                  {form.formState.errors.description && (
                    <FieldError
                      errors={[form.formState.errors.description]}
                    />
                  )}
                </div>
              </>
            )}

            {/* Instruction */}
            {resourceType === 'Instruction' && (
              <div className="space-y-2">
                <FieldLabel htmlFor="instruction-body">
                  Body
                </FieldLabel>

                <Textarea
                  id="instruction-body"
                  {...form.register('description')}
                  placeholder="Write the instructions here..."
                  className="h-96 resize-y"
                  aria-invalid={
                    !!form.formState.errors.description
                  }
                />

                {form.formState.errors.description && (
                  <FieldError
                    errors={[form.formState.errors.description]}
                  />
                )}
              </div>
            )}

            {/* Link */}
            {resourceType === 'Link' && (
              <>
                <div className="space-y-2">
                  <FieldLabel htmlFor="link-name">
                    Name
                  </FieldLabel>

                  <Input
                    id="link-name"
                    {...form.register('name')}
                    placeholder="Name"
                    aria-invalid={!!form.formState.errors.name}
                  />

                  {form.formState.errors.name && (
                    <FieldError
                      errors={[form.formState.errors.name]}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="link-url">
                    URL
                  </FieldLabel>

                  <Input
                    id="link-url"
                    type="url"
                    {...form.register('url')}
                    placeholder="https://example.com"
                    aria-invalid={!!form.formState.errors.url}
                  />

                  {form.formState.errors.url && (
                    <FieldError
                      errors={[form.formState.errors.url]}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="link-info">
                    Info
                  </FieldLabel>

                  <Input
                    id="link-info"
                    {...form.register('description')}
                    placeholder=""
                    aria-invalid={
                      !!form.formState.errors.description
                    }
                  />

                  {form.formState.errors.description && (
                    <FieldError
                      errors={[form.formState.errors.description]}
                    />
                  )}
                </div>
              </>
            )}
          </FieldGroup>

          {isError && (
            <p className="mt-4 text-sm text-destructive">
              Failed to {isEditing ? 'update' : 'create'} resource.
            </p>
          )}

          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />

            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save'
                  : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}