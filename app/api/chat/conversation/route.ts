import {
  convertToModelMessages,
  streamText,
  UIMessage,
  validateUIMessages,
} from "ai";
import { google } from "@ai-sdk/google";
import { saveChat } from "@/lib/chat-store";
import { NextResponse } from "next/server";
import { ERROR_MESSAGE } from "@/config/constants";

export const POST = async (req: Request) => {
  const { messages, id }: { messages: UIMessage[]; id: string } =
    await req.json();

  try {
    await validateUIMessages({
      messages,
    });
  } catch (error) {
    console.error("Database messages validation failed:", error);
    NextResponse.json(
      {
        error: {
          code: "INVALID_MESSAGES",
          message: ERROR_MESSAGE.INVALID_MESSAGES,
        },
      },
      { status: 400 }
    );
  }

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
};
