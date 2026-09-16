import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetUsers } from '@/hooks/useGetUsers';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { Card, CardContent } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useCreateCourse from '@/hooks/useCreateCourse';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import dayjs from 'dayjs';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import type { DatabaseUser } from '@/types';
import { useNavigate } from 'react-router';

const schema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().min(20, 'Course description must be at least 10 characters long'),
  startDate: z.date().min(new Date(), 'Start date must be in the future'),
  endDate: z.date(),
  imageURL: z.string().optional(),
  students: z.array(z.string()).optional(),
  teacher: z.string().min(1, 'Teacher is required'),
});

export default function CreateCourse() {
  const anchor = useComboboxAnchor();
  const navigate = useNavigate();
  const { data: allUsers, isLoading, error } = useGetUsers();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      imageURL: '',
      students: [],
      teacher: '',
    },
  });

  const { mutate: createCourse, isPending } = useCreateCourse(() => {
    form.reset();
    navigate('/courses', { replace: true });
  });

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error || !allUsers) {
    return (
      <div className="py-10">
        <Error />
      </div>
    );
  }

  const { availableStudents, availableTeachers } = allUsers.reduce(
    (
      acc: { availableStudents: { [key: string]: DatabaseUser }; availableTeachers: { [key: string]: DatabaseUser } },
      user,
    ) => {
      if (user.courseId === null) {
        if (user.role === 'Student') {
          acc.availableStudents[user.id.toString()] = user;
        } else if (user.role === 'Teacher') {
          acc.availableTeachers[user.id.toString()] = user;
        }
      }
      return acc;
    },
    { availableStudents: {}, availableTeachers: {} },
  );

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    // check dates
    if (dayjs(data.startDate).isAfter(dayjs(data.endDate))) {
      form.setError('endDate', { type: 'manual', message: 'End date must be after start date' });
      return;
    }

    // combine students and teacher into users array
    const users = [...(data.students || []), data.teacher];

    createCourse({
      name: data.name,
      description: data.description,
      startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
      imageURL: data.imageURL,
      users,
    });
  };

  return (
    <div className="py-2">
      <h1 className="text-2xl font-bold pb-6">Create a New Course</h1>
      <Card className="max-w-2xl">
        <CardContent>
          <form id="create-course-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Course Name</FieldLabel>
                    <Input
                      {...field}
                      id="Name *"
                      aria-invalid={fieldState.invalid}
                      placeholder="Course Name"
                      autoCapitalize="on"
                      autoComplete="off"
                      className="py-5"
                      disabled={isPending}
                      required
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
                    <FieldLabel htmlFor="description">Course Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="Description *"
                      aria-invalid={fieldState.invalid}
                      placeholder="Course Description"
                      className="py-5 resize-none"
                      disabled={isPending}
                      required
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="flex gap-4 items-start justify-start">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="date-picker-simple">Start Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button variant="outline" id="date-picker-simple" className="justify-start py-5">
                              {field.value ? dayjs(field.value).format('DD MMM YYYY') : <span>Pick a date</span>}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="date-picker-simple">End Date</FieldLabel>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button variant="outline" id="date-picker-simple" className="justify-start  py-5">
                              {field.value ? dayjs(field.value).format('DD MMM YYYY') : <span>Pick a date</span>}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="imageURL"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="imageURL">Course Image URL</FieldLabel>
                    <Input
                      {...field}
                      id="imageURL"
                      aria-invalid={fieldState.invalid}
                      placeholder="Course Image URL"
                      autoCapitalize="on"
                      autoComplete="off"
                      className="py-5"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="students"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="students">Students</FieldLabel>
                    <Combobox
                      autoHighlight
                      value={field.value}
                      onValueChange={field.onChange}
                      items={Object.values(availableStudents)}
                      multiple
                      id="students">
                      <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                          {(field.value || []).map((userId) => (
                            <ComboboxChip key={userId}>
                              {availableStudents[userId]?.firstName} {availableStudents[userId]?.lastName}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput className="py-1" placeholder="" />
                      </ComboboxChips>
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {Object.values(availableStudents)?.map((user) => (
                            <ComboboxItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                )}
              />
              <Controller
                name="teacher"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="teacher">Teacher</FieldLabel>
                    <Combobox
                      autoHighlight
                      value={field.value}
                      onValueChange={field.onChange}
                      items={Object.values(availableTeachers)}
                      id="teacher">
                      <ComboboxChips>
                        <ComboboxChipsInput
                          className="py-1"
                          value={
                            field.value
                              ? availableTeachers[field.value]?.firstName +
                                ' ' +
                                availableTeachers[field.value]?.lastName
                              : ''
                          }
                          placeholder=""
                        />
                      </ComboboxChips>
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {Object.values(availableTeachers)?.map((user) => (
                            <ComboboxItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                )}
              />
            </FieldGroup>
            <Button form="create-course-form" type="submit" disabled={isPending} className="flex-1 py-5 mt-6 w-full">
              {isPending ? 'Creating...' : 'Create Course'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
