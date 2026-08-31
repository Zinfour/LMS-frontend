import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(50, 'Password must be at most 50 characters.')
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least 1 lowercase letter',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least 1 uppercase letter',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must contain at least 1 number',
    }),
});

export default function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
    console.log({ email, password });
  };

  return (
    <div className="flex flex-1 items-center pt-8">
      <Card className="flex-1 max-w-lg mx-auto w-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold">Register</CardTitle>
          <CardDescription>
            Welcome to our movie app! Please register to create your account and explore the world of movies.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form id="register-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email:</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="gggg@gmail.com"
                      autoCapitalize="off"
                      autoComplete="off"
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
                    <FieldLabel htmlFor="password">Password:</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoCapitalize="off"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button form="register-form" type="submit" className="w-[80%] mx-auto py-5">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
