import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import type { User } from '@/hooks/usePersistentStore';
import type { ActivityAssignment, Submission } from '@/hooks/useGetModuleById';
import useCreateSubmission from '@/hooks/useCreateSubmission';

const formSchema = z.object({
  textField: z.string().trim().nonempty('You cannot submit an empty answer.'),
});

interface Props {
  assignment: ActivityAssignment;
  submission?: Submission;
  user: User;
}

export default function SubmissionCard({ assignment, submission, user }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      textField: '',
    },
  });

  const createSubmission = useCreateSubmission();

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    createSubmission.mutate(
      {
        text: values.textField,
        studentId: user.id,
        assignmentId: assignment.id,
      },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: (error) => {
          console.log('Error during submit.', error);
        },
      },
    );
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
            <Button
              form="submission-form"
              type="submit"
              className="mx-auto py-5"
              disabled={createSubmission.isPending}
            >
              {createSubmission.isPending ? 'Submitting...' : 'Submit'}
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
