import { Badge } from '@/components/ui/badge';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/hooks/useStore';
import { useNavigate } from 'react-router';

const BADGES = ['Course', 'Module', 'Activity', 'Resource'];

const formSchema = z.object({
  email: z.email(),
  password: z.string().nonempty('Password is required'),
  keepLogin: z.boolean(),
});

export default function Login() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      keepLogin: false,
    },
  });

  const handleFormSubmit = async ({ email, password, keepLogin }: z.infer<typeof formSchema>) => {
    console.log({ email, password, keepLogin });

    // TODO: Update this with real stuff
    if (email === 'student@gmail.com') {
      setUser({
        id: 1,
        username: 'Elin Sandström',
        email: 'elin@sandstrom.com',
        role: 'student',
        imageURL:
          'https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      });
      navigate('/', { replace: true });
    } else if (email === 'teacher@gmail.com') {
      setUser({
        id: 10,
        username: 'John Doe',
        email: 'john@doe.com',
        role: 'teacher',
      });
      navigate('/', { replace: true });
    } else {
      form.setError('email', { type: 'manual', message: undefined });
      form.setError('password', { type: 'manual', message: 'Invalid email or password' });
    }
  };

  return (
    <div className="flex h-full w-screen">
      <div className="flex gap-2 items-center fixed top-4 left-4 text-foreground md:text-card ">
        <div className="px-1.5 py-1.5 rounded-lg bg-[rgb(47,75,217)]">
          <MdOutlineCheckBoxOutlineBlank className="size-5 color-white fill-white" />
        </div>
        <span className="text-xl font-medium">Kursportalen</span>
      </div>
      <div className="hidden md:flex flex-col h-full px-8 w-[50%] bg-card-foreground text-card lg">
        <div className="max-w-150 flex flex-col h-full py-10">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">Everything for your course, in one place.</h1>
            <p className="font-light text-muted-foreground leading-relaxed mb-8">
              Modules, activities and resources - with deadlines and progress that stay in sync between students and
              teachers.
            </p>
            <div className="flex gap-2 items-center flex-wrap">
              {BADGES.map((badgeLabel) => (
                <Badge
                  key={badgeLabel}
                  variant="outline"
                  className="text-muted-foreground border-muted-foreground px-3 py-3">
                  {badgeLabel}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground font-light text-sm">Faculty of IT - Autumn term 2026</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[50%] px-10 flex items-center justify-center">
        <div className="flex-1 max-w-110 mx-auto">
          <h1 className="text-3xl font-bold text-center mb-5">Log in</h1>
          <form className="flex-1" id="login-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="student@gmail.com"
                      autoCapitalize="off"
                      autoComplete="off"
                      className="py-5"
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
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoCapitalize="off"
                      autoComplete="off"
                      className="py-5"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="keepLogin"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-start mb-6 ">
                    <Input
                      className="w-4! h-4"
                      id="keepLogin"
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <FieldLabel className="text-muted-foreground" htmlFor="keepLogin">
                      Keep me logged in for 30 days
                    </FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
            <Button form="login-form" type="submit" className="w-full py-5">
              Log in
            </Button>
          </form>
          <Separator className="h-px mt-5 mb-2 w-[90%] mx-auto" />
          <p className="text-center text-muted-foreground font-light text-sm cursor-pointer hover:text-foreground">
            Forgot password?
          </p>
        </div>
      </div>
    </div>
  );
}
