import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
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

import type { ActivityResource, ModuleResource } from '@/hooks/useGetModuleById';
import type { ResourceType } from '@/types';
import useCreateActivityResource from '@/hooks/useCreateActivityResource';
import useUpdateActivityResource from '@/hooks/useUpdateActivityResource';
import useCreateModuleResource from '@/hooks/useCreateModuleResource';
import useUpdateModuleResource from '@/hooks/useUpdateModuleResource';

interface ActivityResourceProps {
  activityId: number;
  moduleId?: never;
  resourceType: Extract<ResourceType, 'TextMaterial' | 'Instruction' | 'Link'>;
  buttonText?: string;
  resource?: ActivityResource;
}

interface ModuleResourceProps {
  moduleId: number;
  activityId?: never;
  resourceType: 'Link';
  buttonText?: string;
  resource?: ModuleResource;
}

type Props = ActivityResourceProps | ModuleResourceProps;

type FormProps = Props & {
  setDialogOpen: (open: boolean) => void;
};

const formSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().min(1, 'This field is required.'),
  url: z.url('Please enter a valid URL.').or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const Form = ({ activityId, moduleId, resourceType, resource, setDialogOpen }: FormProps) => {
  const isEditing = resource !== undefined;
  const isModuleResource = moduleId !== undefined;

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
  const createModuleResource = useCreateModuleResource();
  const updateModuleResource = useUpdateModuleResource();

  const isPending =
    createActivityResource.isPending ||
    updateActivityResource.isPending ||
    createModuleResource.isPending ||
    updateModuleResource.isPending;

  const error =
    createActivityResource.error ||
    updateActivityResource.error ||
    createModuleResource.error ||
    updateModuleResource.error;

  const formId = isEditing ? `edit-resource-form-${resource.id}` : 'create-resource-form';

  const errorMessage = axios.isAxiosError(error)
    ? typeof error.response?.data === 'string'
      ? error.response.data
      : 'Something went wrong.'
    : 'Something went wrong.';

  const handleSuccess = () => {
    form.reset();
    setDialogOpen(false);
  };

  const handleFormSubmit = (data: FormValues) => {
    const values = {
      name: data.name,
      description: data.description,
      url: data.url || undefined,
    };

    if (isEditing) {
      if (isModuleResource) {
        updateModuleResource.mutate(
          {
            moduleId,
            resource,
            ...values,
          },
          { onSuccess: handleSuccess },
        );
      } else {
        updateActivityResource.mutate(
          {
            activityId,
            resource,
            ...values,
          },
          { onSuccess: handleSuccess },
        );
      }

      return;
    }

    if (isModuleResource) {
      createModuleResource.mutate(
        {
          moduleId,
          resourceType,
          ...values,
        },
        { onSuccess: handleSuccess },
      );
    } else {
      createActivityResource.mutate(
        {
          activityId,
          resourceType,
          ...values,
        },
        { onSuccess: handleSuccess },
      );
    }
  };

  return (
    <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit ' : 'Add '}
            {resourceType === 'TextMaterial' ? 'text' : resourceType === 'Instruction' ? 'instructions' : 'link'}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup>
          {/* TextMaterial */}
          {resourceType === 'TextMaterial' && (
            <>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="text-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="text-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Title"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="text-body">Body</FieldLabel>
                    <Textarea
                      {...field}
                      id="text-body"
                      aria-invalid={fieldState.invalid}
                      placeholder="Write your text here..."
                      className="h-96 max-h-[60vh] resize-y"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </>
          )}

          {/* Instruction */}
          {resourceType === 'Instruction' && (
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="instruction-body">Body</FieldLabel>
                  <Textarea
                    {...field}
                    id="instruction-body"
                    aria-invalid={fieldState.invalid}
                    placeholder="Write the instructions here..."
                    className="h-96 max-h-[60vh] resize-y"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {/* Link */}
          {resourceType === 'Link' && (
            <>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="link-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="link-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Name"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="link-url">URL</FieldLabel>
                    <Input
                      {...field}
                      id="link-url"
                      type="url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://example.com"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="link-info">Info</FieldLabel>
                    <Input
                      {...field}
                      id="link-info"
                      aria-invalid={fieldState.invalid}
                      placeholder=""
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>

        {error && <p className="mt-4 text-sm text-destructive">{errorMessage}</p>}

        <DialogFooter className="mt-6">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            }
          />

          <Button type="submit" form={formId} disabled={isPending}>
            {isPending ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
};

export default function ResourceDialog(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isEditing = props.resource !== undefined;

  return (
    <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        render={
          isEditing ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 bottom-1"
              aria-label="Edit resource">
              <Pencil className="size-4" />
            </Button>
          ) : (
            <Button variant="outline" className="w-fit">
              {props.buttonText}
            </Button>
          )
        }
      />

      {dialogOpen && <Form {...props} setDialogOpen={setDialogOpen} />}
    </Dialog>
  );
}