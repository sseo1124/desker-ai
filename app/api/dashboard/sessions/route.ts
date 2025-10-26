import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ERROR_MESSAGE } from "@/config/constants";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND_USERID",
          message: ERROR_MESSAGE.NOT_FOUND_USERID,
        },
      },
      { status: 400 }
    );
  }

  const chatbot = await prisma.chatbot.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!chatbot) {
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

  const botId = chatbot.id;
  try {
    const chatBotSessions = await prisma.chatSession.findMany({
      where: { botId },
      select: {
        id: true,
        visitorId: true,
        createdAt: true,
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { id: true, sender: true, content: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (chatBotSessions) {
      return NextResponse.json(chatBotSessions, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "CHAT_LIST_FETCH_FAILURE",
          message: ERROR_MESSAGE.CHAT_LIST_FETCH_FAILURE,
        },
      },
      { status: 500 }
    );
  }
};
