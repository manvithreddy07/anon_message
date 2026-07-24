'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sparkles } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useForm, useWatch } from "react-hook-form";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/Apiresponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';


const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString?.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your favorite Place?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = useWatch({
    control: form.control,
    name: "content",
    defaultValue: "",
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username,
      });

      toast( "Success", {
        description: response.data.message,
        position: 'bottom-right',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [suggestedMessages, setSuggestedMessages] =useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      setError(null);

      const response = await fetch("/api/chat", {
        method: "POST",
      });

      const data = await response.json();

      setSuggestedMessages(data.text);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggested messages.");
    } finally {
      setIsSuggestLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-black px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

    <div className="mx-auto w-full max-w-4xl">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-5 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 sm:px-5 sm:text-sm">
          🔒 100% Anonymous
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Send Anonymous Feedback
        </h1>
        <p className="mt-4 text-base text-gray-400 sm:text-lg">
          Your identity will never be revealed.
        </p>
      </div>
      {/* Message Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel className="text-base text-gray-200 sm:text-lg">
              Message for @{username}
            </FieldLabel>
            <Textarea
              placeholder="Write something kind, honest or fun..."
              className="min-h-30 w-full resize-none rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-cyan-500"
              {...form.register("content")}
            />
            <FieldError
              errors={[form.formState.errors.content]}
            />
          </Field>

          <Button
            type="submit"
            disabled={isLoading || !messageContent}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-5 text-base font-semibold shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02] sm:py-6 sm:text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Anonymous Message"
            )}
          </Button>
        </form>
      </div>

      {/* Suggestions */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Need Inspiration?
            </h2>
            <p className="text-gray-400">
              Generate anonymous message ideas.
            </p>
          </div>
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            className="w-full cursor-pointer bg-cyan-600 hover:bg-cyan-700 sm:w-auto"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isSuggestLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Suggest Messages Using AI"
            )}
          </Button>
        </div>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {parseStringMessages(suggestedMessages)?.map(
              (message, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleMessageClick(message)}
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-gray-300 transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300 sm:px-5 sm:py-3"
                >
                  {message}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-14 rounded-3xl border border-cyan-500/20 bg-linear-to-r from-cyan-500/10 to-blue-600/10 p-6 text-center sm:p-8 lg:p-10">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Want Your Own Anonymous Inbox?
        </h2>
        <p className="mt-3 text-gray-400">
          Create your own profile and start receiving anonymous feedback from anyone.
        </p>
        <Link href="/sign-up">
          <Button className="mt-6 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-5 text-base shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500 sm:w-auto sm:px-10 sm:py-6">
            Create Free Account
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
}