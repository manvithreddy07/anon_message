import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';
import { z } from 'zod';
import { messageSchema } from '@/schemas/messageSchema';
import { clientKey, enforceLimits, readMessageBody } from '@/lib/abuseProtection';

const sendMessageSchema = messageSchema.extend({
  username: z.string().trim().min(1).max(254),
  content: messageSchema.shape.content.trim().min(10).max(300),
});

export async function POST(request: Request) {
  try {
    const limited = await enforceLimits([
      { key: `messages:client:${clientKey(request)}`, maximum: 5, windowMs: 60_000 },
      { key: 'messages:global', maximum: 100, windowMs: 60_000 },
    ]);
    if (limited) return limited;

    let body: unknown;
    try {
      body = await readMessageBody(request);
    } catch {
      return Response.json(
        { success: false, message: 'Invalid JSON or request body exceeds 4096 bytes' },
        { status: 400 }
      );
    }
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, message: 'A valid username and a message of 10 to 300 characters are required' },
        { status: 400 }
      );
    }
    const { username, content } = parsed.data;
    const recipientLimited = await enforceLimits([
      { key: `messages:recipient:${username}`, maximum: 30, windowMs: 3_600_000 },
    ]);
    if (recipientLimited) return recipientLimited;

    await dbConnect();
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
