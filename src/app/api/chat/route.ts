import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { clientKey, enforceLimits } from '@/lib/abuseProtection';

export async function POST(request: Request) {
  try {
    const limited = await enforceLimits([
      { key: `chat:client:${clientKey(request)}`, maximum: 3, windowMs: 60_000 },
      { key: 'chat:hour', maximum: 60, windowMs: 3_600_000 },
      { key: 'chat:day', maximum: 500, windowMs: 86_400_000 },
    ]);
    if (limited) return limited;

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";;

    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      prompt,
      maxOutputTokens: 256,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(15_000),
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
