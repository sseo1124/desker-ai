import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ERROR_MESSAGE } from "@/config/constants";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) => {
  try {
    const userSession = await auth();
    const userChatbotId = userSession.botId;

    if (!userChatbotId) {
      return NextResponse.json(
        {
          error: {
            code: "CHATBOT_NOT_FOUND",
            message: ERROR_MESSAGE.CHATBOT_NOT_FOUND,
          },
        },
        { status: 404 }
      );
    }

    const { sessionId } = await params;
    const chatBotSessions = await prisma.chatSession.findFirst({
      where: { id: sessionId, botId: userChatbotId },
      select: {
        id: true,
        visitorId: true,
        createdAt: true,
      },
    });

    if (!chatBotSessions) {
      return NextResponse.json(
        {
          error: {
            code: "CHAT_LIST_FETCH_FAILURE",
            message: ERROR_MESSAGE.CHAT_LIST_FETCH_FAILURE,
          },
        },
        { status: 404 }
      );
    }

    const chatMessages = await prisma.chatMessage.findMany({
      where: { sessionId: chatBotSessions.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, sender: true, content: true, createdAt: true },
    });

    const chatMessageObjects = chatMessages.map((message) => {
      const contentMessage = JSON.parse(message.content);
      return {
        messageId: message.id,
        sender: message.sender,
        content: contentMessage,
        createdAt: message.createdAt,
      };
    });

    return NextResponse.json(
      {
        chatMessageObjects,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "MESSAGE_FETCH_FAILURE",
          message: ERROR_MESSAGE.MESSAGE_FETCH_FAILURE,
        },
      },
      { status: 500 }
    );
  }
};
