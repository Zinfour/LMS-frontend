import { api } from '@/api';
import { API_BASE_URL } from '@/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import type { Activity } from '@/hooks/useGetMyCourse';
import type { User } from '@/hooks/usePersistentStore';
import { queryClient } from '@/main';

const formSchema = z.object({
  textField: z.string().trim().nonempty('You cannot submit an empty answer.'),
});

export interface Submission {
  text: string;
  createdAt: string;
  studentId: string;
  assignmentId: number;
}

interface Props {
  activity: Activity;
  submission?: Submission;
  user: User;
}

export default function SubmissionCard({ activity, submission, user }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      textField: '',
    },
  });

  const handleFormSubmit = async ({ textField }: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post(`${API_BASE_URL}/submissions`, {
        text: textField,
        studentId: user.id,
        assignmentId: activity.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ['submissions', user.id],
      });

      form.reset();
    } catch (error) {
      console.log('Error during submit.', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">My submission</CardTitle>
      </CardHeader>

      {submission === undefined ? (
        <>
          <CardContent>
            <form id="submission-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
              <FieldGroup>
                <Controller
                  name="textField"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="textField" className="ps-2">
                        Your answer
                      </FieldLabel>

                      <Textarea
                        {...field}
                        id="textField"
                        aria-invalid={fieldState.invalid}
                        placeholder="Write your answer here..."
                        className="min-h-100 resize-y"
                      />

                      <div className="min-h-5">{fieldState.invalid && <FieldError errors={[fieldState.error]} />}</div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter>
            <Button form="submission-form" type="submit" className="mx-auto w-20 py-5">
              Submit
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent>
          {/* Received */}
          <div className="flex items-center gap-3 rounded-xl border bg-green-500/10 px-2 py-2">
            <div className="flex size-6 items-center justify-center rounded-xl bg-green-600 text-white">
              <Check className="size-4" />
            </div>

            <p>Received {dayjs(submission.createdAt).format('D MMM YYYY, HH:mm')}</p>
          </div>

          <div className="text-muted-foreground pt-4 pb-2 ps-2">Your submitted answer:</div>

          <div className="rounded-xl border bg-muted/30 p-5 whitespace-pre-wrap text-justify">{submission.text}</div>
        </CardContent>
      )}
    </Card>
  );
}
