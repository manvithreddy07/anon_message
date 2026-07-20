'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
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
    <div className="container mx-auto my-8 p-6 bg-muted rounded max-w-5xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Field>
          <FieldLabel>
            Send Anonymous Message to @{username}
          </FieldLabel>

          <Textarea
            placeholder="Write your anonymous message here"
            className="resize-none"
            {...form.register("content")}
          />

          <FieldError
            errors={[form.formState.errors.content]}
          />
        </Field>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading || !messageContent}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Send It"
            )}
          </Button>
        </div>
      </form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              parseStringMessages(suggestedMessages)?.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}