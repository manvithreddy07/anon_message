'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast('Login Failed', {
          description: 'Incorrect username or password',
        });
      } else {
        toast('Error', {
          description: result.error,
        });
      }
      return;
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h4 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-4xlxl">
            Welcome Back to Anon-Messanger
          </h4>
          <p className="mb-4">
            Sign in to continue your secret conversations
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel>Email / Username</FieldLabel>

            <Input
              placeholder="Enter your email or username"
              {...form.register('identifier')}
            />

            <FieldError errors={[form.formState.errors.identifier]} />
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>

            <Input
              type="password"
              placeholder="Enter your password"
              {...form.register('password')}
            />

            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}