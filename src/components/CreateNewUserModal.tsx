import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { useState } from 'react';
import useGetCourses from '@/hooks/useGetCourses';
import { Button } from './ui/button';
import { FieldGroup, Field, FieldLabel, FieldError } from './ui/field';
import { Input } from './ui/input';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  Select,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import useCreateUser from '@/hooks/usCreateUser';
import useEditUser from '@/hooks/useEditUser';
import { cn } from '@/lib/utils';

interface Props {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'Student' | 'Teacher';
    courseId: number;
    imageUrl?: string;
  };
  type?: 'create' | 'edit';
}

const RolesOptions = [
  { label: 'Student', value: 'Student' },
  { label: 'Teacher', value: 'Teacher' },
];

const schema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['Student', 'Teacher'], { message: 'Role must be either student or teacher.' }),
  imageUrl: z.string().optional(),
  courseId: z.number().optional(),
});

const Form = ({ type, user, setDialogOpen }: Props & { setDialogOpen: (open: boolean) => void }) => {
  const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } = useGetCourses();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'Student',
      imageUrl: user?.imageUrl || '',
      courseId: user?.courseId || 0,
    },
  });

  const { mutate: createUser, isPending } = useCreateUser(() => {
    form.reset();
    setDialogOpen(false);
  });

  const { mutate: editUser, isPending: isEditPending } = useEditUser(user?.id || '', () => {
    form.reset();
    setDialogOpen(false);
  });

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    console.log('Editing user with data:', data);

    if (type === 'create') {
      createUser({
        ...data,
        courseId: data.courseId === 0 ? undefined : data.courseId,
      });
    } else {
      editUser({
        ...data,
        courseId: data.courseId === 0 ? undefined : data.courseId,
      });
    }
  };

  const coursesOptions = courses?.map((course) => ({ label: course.name, value: course.id })) ?? [];

  const isFormPending = isPending || isEditPending;
  const formId = type === 'create' ? 'create-user-form' : `edit-user-form-${user?.id}`;
  console.log(form.getValues(), 'form values');
  console.log(form.formState.errors, 'form errors');
  return (
    <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)}>
      <DialogContent className="sm:max-w-sm xl:max-w-xl w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'Create New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        {isCoursesLoading ? (
          <div className="flex items-center justify-center py-20">
            <p>Loading courses...</p>
          </div>
        ) : isCoursesError ? (
          <div className="flex items-center justify-center py-20">
            <p>Error loading courses.</p>
          </div>
        ) : (
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    id="firstName *"
                    aria-invalid={fieldState.invalid}
                    placeholder="John"
                    autoCapitalize="on"
                    autoComplete="off"
                    className="py-3"
                    disabled={isFormPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    id="lastName *"
                    aria-invalid={fieldState.invalid}
                    placeholder="Doe"
                    autoCapitalize="on"
                    autoComplete="off"
                    className="py-3"
                    disabled={isFormPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    className="py-3"
                    type="email"
                    disabled={isFormPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="password">Password *</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="*********"
                    autoComplete="new-password"
                    className="py-3"
                    type="password"
                    disabled={isFormPending}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="role">Role *</FieldLabel>
                  <Select
                    items={RolesOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={isFormPending}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {RolesOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="courseId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="courseId">Course</FieldLabel>
                  <Select
                    items={[{ label: 'N/A', value: 0 }, ...coursesOptions]}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={isFormPending}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Courses</SelectLabel>
                        {[{ label: 'N/A', value: 0 }, ...coursesOptions].map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="imageUrl">Profile image url</FieldLabel>
                  <Input
                    {...field}
                    id="imageUrl"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://example.com/profile.jpg"
                    autoComplete="off"
                    className="py-3"
                    type="url"
                    disabled={isFormPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        )}
        <DialogFooter>
          <DialogClose className="flex-1 py-4" render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form={formId} disabled={isFormPending} className="flex-1 py-4">
            {type === 'create'
              ? isFormPending
                ? 'Creating...'
                : 'Create User'
              : isFormPending
                ? 'Saving...'
                : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
};

export default function CreateNewUserModal({ user, type = 'create' }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        render={
          <Button
            variant={type === 'create' ? 'default' : 'outline'}
            className={cn('h-10 px-8', type === 'create' && 'absolute right-0')}>
            {type === 'create' ? 'Create New' : 'Edit'}
          </Button>
        }
      />
      {dialogOpen && <Form type={type} setDialogOpen={setDialogOpen} user={user} />}
    </Dialog>
  );
}
