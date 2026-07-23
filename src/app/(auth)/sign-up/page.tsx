'use client';

import { ApiResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { BorderBeam } from '@/components/ui/border-beam';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username) return;

      setIsCheckingUsername(true);
      setUsernameMessage('');

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        setUsernameMessage(
          axiosError.response?.data.message ??
            'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (
    data: z.infer<typeof signUpSchema>
  ) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      );

      toast.success('Success', {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error(error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast.error('Sign Up Failed', {
        description:
          axiosError.response?.data.message ??
          'There was a problem with your sign-up.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-gray-900 to-black px-6 ">

      {/* Background Glow */}
      <div className="absolute left-20 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[150px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Create Account
          </h1>

          <p className="mt-3 text-gray-400">
            Start receiving anonymous feedback today.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Username */}
          <Field>
            <FieldLabel className="text-gray-200">
              Username
            </FieldLabel>

            <Input
              placeholder="Choose a username"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register('username')}
              onChange={(e) => {
                form.setValue('username', e.target.value);
                debounced(e.target.value);
              }}
            />

            {isCheckingUsername && (
              <div className="mt-2 flex items-center text-cyan-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm">
                  Checking username...
                </span>
              </div>
            )}

            {!isCheckingUsername && usernameMessage && (
              <p
                className={`mt-2 text-sm ${
                  usernameMessage === 'Username is unique'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {usernameMessage}
              </p>
            )}

            <FieldError
              errors={[form.formState.errors.username]}
            />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel className="text-gray-200">
              Email
            </FieldLabel>

            <Input
              type="email"
              placeholder="Enter your email"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register('email')}
            />

            <FieldDescription className="text-gray-500">
              We will send a verification code to this email.
            </FieldDescription>

            <FieldError
              errors={[form.formState.errors.email]}
            />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel className="text-gray-200">
              Password
            </FieldLabel>

            <Input
              type="password"
              placeholder="Create a password"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register('password')}
            />

            <FieldError
              errors={[form.formState.errors.password]}
            />
          </Field>

          {/* Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-6 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-white/10" />
          <span className="mx-4 text-sm text-gray-500">
            OR
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Sign In */}
        <div className="text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Sign In
          </Link>
        </div>

        {/* Border Beam */}
        <BorderBeam
          duration={6}
          delay={2}
          size={350}
          borderWidth={2}
          className="from-transparent via-cyan-500 to-transparent"
        />
      </div>
    </div>
  );
}