import { useState } from 'react';
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
import { FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import useCreateActivityResource, { type ResourceType } from '@/hooks/useCreateActivityResource';

interface Props {
  activityId: number;
  resourceType: ResourceType;
  buttonText: string;
}

const formSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().min(1, 'This field is required.'),
  url: z.url('Please enter a valid URL.').or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateResourceDialog({ activityId, resourceType, buttonText }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      url: '',
    },
  });

  const createActivityResource = useCreateActivityResource();

  const handleFormSubmit = (values: FormValues) => {
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

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      form.reset();
      createActivityResource.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="w-fit">
            {buttonText}
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {resourceType === 'TextMaterial' ? 'text' : resourceType === 'Instruction' ? 'instructions' : 'link'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            {/* TextMaterial */}
            {resourceType === 'TextMaterial' && (
              <>
                <div className="space-y-2">
                  <FieldLabel htmlFor="text-title">Title</FieldLabel>

                  <Input
                    id="text-title"
                    {...form.register('name')}
                    placeholder="Title"
                    aria-invalid={!!form.formState.errors.name}
                  />

                  {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="text-body">Body</FieldLabel>

                  <Textarea
                    id="text-body"
                    {...form.register('description')}
                    placeholder="Write your text here..."
                    className="h-96 resize-y"
                    aria-invalid={!!form.formState.errors.description}
                  />

                  {form.formState.errors.description && <FieldError errors={[form.formState.errors.description]} />}
                </div>
              </>
            )}

            {/* Instruction */}
            {resourceType === 'Instruction' && (
              <div className="space-y-2">
                <Textarea
                  id="instruction-body"
                  {...form.register('description')}
                  placeholder="Write the instructions here..."
                  className="h-96 resize-y"
                  aria-invalid={!!form.formState.errors.description}
                />

                {form.formState.errors.description && <FieldError errors={[form.formState.errors.description]} />}
              </div>
            )}

            {/* Link */}
            {resourceType === 'Link' && (
              <>
                <div className="space-y-2">
                  <FieldLabel htmlFor="link-name">Name</FieldLabel>

                  <Input
                    id="link-name"
                    {...form.register('name')}
                    placeholder="Name"
                    aria-invalid={!!form.formState.errors.name}
                  />

                  {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="link-url">URL</FieldLabel>

                  <Input
                    id="link-url"
                    type="url"
                    {...form.register('url')}
                    placeholder="https://example.com"
                    aria-invalid={!!form.formState.errors.url}
                  />

                  {form.formState.errors.url && <FieldError errors={[form.formState.errors.url]} />}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="link-info">Info</FieldLabel>

                  <Input
                    id="link-info"
                    {...form.register('description')}
                    placeholder=""
                    aria-invalid={!!form.formState.errors.description}
                  />

                  {form.formState.errors.description && <FieldError errors={[form.formState.errors.description]} />}
                </div>
              </>
            )}
          </FieldGroup>

          {createActivityResource.isError && (
            <p className="mt-4 text-sm text-destructive">Failed to create resource.</p>
          )}

          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />

            <Button type="submit" disabled={createActivityResource.isPending}>
              {createActivityResource.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
