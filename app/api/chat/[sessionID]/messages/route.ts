import { ERROR_MESSAGE } from "@/config/constants";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ sessionID: string }> }
) => {
  const { sessionID } = await params;
  const sessionExists = await prisma.chatSession.findUnique({
    where: { id: sessionID },
  });

  if (!sessionExists) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND_MESSAGES",
          message: ERROR_MESSAGE.SESSION_NOT_FOUND,
        },
      },
      { status: 404 }
    );
  }

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: sessionID },
      select: {
        id: true,
        sender: true,
        content: true
      },
      orderBy: { createdAt: "asc" },
    });

    const uiMessages = messages.map((msg) => ({
      id: msg.id,
      role: msg.sender === "VISITOR" ? "user" : "assistant",
      parts: msg.content ? JSON.parse(msg.content) : [],
    }));

    return NextResponse.json(
      { messages: uiMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("메세지 불러오기 에러: ", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "채팅방 메시지 조회하는데 실패했습니다.",
        },
      },
      { status: 500 }
    );
  }
};
