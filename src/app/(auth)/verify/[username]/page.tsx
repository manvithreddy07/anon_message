'use client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { ShieldCheck } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast.success('Verification Successful', {
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error('Verification Failed', {
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-gray-900 to-black px-6">
      {/* Background Glow */}
      <div className="absolute left-20 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[150px]" />
      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        </div>
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
            🔐 Secure Verification
          </span>
        </div>
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Verify Account
          </h1>
          <p className="mt-3 text-gray-400">
            Enter the verification code sent to your email to activate your account.
          </p>
        </div>
        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel className="text-gray-200">
              Verification Code
            </FieldLabel>

            <Input
              placeholder="Enter 6-digit verification code"
              className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register("code")}
            />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>
          <Button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-6 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500"
          >
            Verify Account
          </Button>
        </form>
        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-white/10" />
          <span className="mx-4 text-sm text-gray-500">
            Secure
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        {/* Footer */}
        <div className="text-center text-gray-400">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300 cursor-pointer"
          >
            Resend Code
          </button>
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