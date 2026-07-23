'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/Apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import * as z from "zod";
import { Input } from '@base-ui/react';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) =>message._id.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => { 
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.warning("Error", {
        description:
          axiosError.response?.data.message ?? 'Failed to fetch message settings',
          position: 'bottom-right',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Refreshed Messages", {
            description: 'Showing latest messages',
            position: 'bottom-right',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.warning("Error", {
          description:
            axiosError.response?.data.message || 'Failed to fetch messages',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    []
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success("Message Settings Updated",     {
        description: response.data.message,
        position: 'bottom-right',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
        position: 'bottom-right',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const profileUrl = `${window.location.origin}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("URL Copied!", {
        description: 'Profile URL has been copied to clipboard.',
        position: 'bottom-right',
      });
    } catch {
      toast.error("Failed to copy URL", {
        description: 'Failed to copy profile URL to clipboard.',
        position: 'bottom-right',
      });
    }
    
  };

return (
  <div className="min-h-screen bg-linear-to-br from-slate-950 via-gray-900 to-black px-6 pt-32 pb-10">
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-5xl font-bold text-white">
            Welcome Back 👋
          </h1>
          <p className="mt-3 text-gray-400">
            Manage your anonymous feedback and profile settings.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Messages
            </>
          )}
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Share Profile */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">
            Share Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Send this link to your friends and receive anonymous feedback.
          </p>
          <div className="mt-6 flex gap-3">
            <Input
              value={profileUrl}
              disabled
              className="border-white/10 bg-white/5 text-white w-xl"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">
            Message Settings
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Control whether people can send you anonymous messages.
          </p>
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <div>
              <p className="font-medium text-white">
                Accept Anonymous Messages
              </p>
              <p className="text-sm text-gray-400">
                {acceptMessages
                  ? "Currently enabled"
                  : "Currently disabled"}
              </p>
            </div>
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Inbox
            </h2>
            <p className="text-gray-400">
              Anonymous messages you have received.
            </p>
          </div>
        </div>
        {messages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <h3 className="text-2xl font-semibold text-white">
              No Messages Yet
            </h3>
            <p className="mt-3 text-gray-400">
              Share your profile link and start receiving anonymous feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default UserDashboard;