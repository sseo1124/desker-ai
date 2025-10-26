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
import { getContext } from "@/lib/rag/context";
import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const { messages, id }: { messages: UIMessage[]; id: string } =
    await req.json();

  const lastMessage = messages[messages.length - 1].parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

  const chatSession = await prisma.chatSession.findUnique({
    where: { id },
    include: { bot: true },
  });

  if (!chatSession || !chatSession.bot) {
    return NextResponse.json(
      {
        error: {
          code: "CHATBOT_NOT_FOUND",
          message: "챗봇 정보를 찾을 수 없습니다.",
        },
      },
      { status: 404 }
    );
  }

  const { bot } = chatSession;
  const context = await getContext(lastMessage, bot.id);
  const systemPrompt = `
    AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    Your name is ${bot.name || "AI Assistant"}.
    Your role is: "${bot.roleDesc}".
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, ${bot.conversationRules}.
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    Here are some rules you must follow:
    - If you are asked about a keyword, follow these rules: ${bot.keywordReplyRules}
  `;

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
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
};
