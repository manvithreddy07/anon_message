'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { signInSchema } from '@/schemas/signInSchema';
import { BorderBeam } from '@/components/ui/border-beam';

import { useSearchParams } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error('Login Failed', {
          description: result.error,
        });
        return;
      }
      if (result?.ok) {
        toast.success('Login Successful', {
          description: 'Welcome back!',
        });
        router.replace('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      setIsGoogleLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-gray-900 to-black px-6">
      {/* Background Glow */}
      <div className="absolute left-20 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[150px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 text-sm font-medium text-cyan-300">
            🔒 Secure Login
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Welcome Back
          </h1>
          <p className="mt-3 text-gray-400">
            Continue your anonymous conversations.
          </p>
        </div>

        {/* Credentials Login */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel className="text-gray-200">
              Email / Username
            </FieldLabel>

            <Input
              placeholder="Enter your email or username"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register('identifier')}
            />

            <FieldError
              errors={[form.formState.errors.identifier]}
            />
          </Field>

          <Field>
            <FieldLabel className="text-gray-200">
              Password
            </FieldLabel>

            <Input
              type="password"
              placeholder="Enter your password"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register('password')}
            />

            <FieldError
              errors={[form.formState.errors.password]}
            />
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-6 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10" />
          <span className="mx-4 text-sm text-gray-500">
            OR
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Login */}
        {error && (
          <p className="text-red-500 mb-1">
            {decodeURIComponent(error)}
          </p>
        )}        
        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center rounded-xl border-white/10 bg-white/5 py-6 text-white transition-all duration-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FcGoogle className="mr-3 h-6 w-6" />

          {isGoogleLoading
            ? 'Redirecting...'
            : 'Continue with Google'}
        </Button>

        {/* Sign Up */}
        <div className="mt-8 text-center text-gray-400">
          Not a member yet?{' '}
          <Link
            href="/sign-up"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Create an account
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