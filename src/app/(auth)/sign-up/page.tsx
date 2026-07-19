'use client';

import { ApiResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback} from 'usehooks-ts'
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
// import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();
  // const { toast } = useToast();

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
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };  
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast("Success", {
        description: response.data.message,
        position: "bottom-right",
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

      toast("Sign Up Failed", {
        description: errorMessage,
        position: "bottom-right",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-mist-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join True Feedback
          </h2>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Field>
                <FieldLabel>Username</FieldLabel>

                <Input
                    {...form.register("username")}
                    onChange={(e) => {
                    form.setValue("username", e.target.value);
                    debounced(e.target.value);
                    }}
                />

                {isCheckingUsername && (
                    <Loader2 className="animate-spin" />
                )}

                {!isCheckingUsername && usernameMessage && (
                    <p
                    className={`text-sm ${
                        usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                    >
                    {usernameMessage}
                    </p>
                )}

                <FieldError errors={[form.formState.errors.username]} />
            </Field>
            <Field>
                <FieldLabel>Email</FieldLabel>

                <Input
                    type="email"
                    {...form.register("email")}
                />

                <FieldDescription>
                    We will send you a verification code.
                </FieldDescription>

                <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field>
                <FieldLabel>Password</FieldLabel>

                <Input
                    type="password"
                    {...form.register("password")}
                />

                <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Button type="submit" className='w-full' disabled={isSubmitting}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </>
                ) : (
                'Sign Up'
                )}
            </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}