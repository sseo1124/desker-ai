import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ERROR_MESSAGE } from "@/config/constants";

export const GET = async (_req: NextRequest) => {
  try {
    const userSession = await auth();
    const userChatbotId = userSession.botId;

    const chatBotSessions = await prisma.chatSession.findMany({
      where: { botId: userChatbotId },
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
      return NextResponse.json({ chatBotSessions }, { status: 200 });
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
