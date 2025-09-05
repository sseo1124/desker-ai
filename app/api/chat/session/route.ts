import { ERROR_MESSAGE } from "@/config/constants";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const botId = searchParams.get("botId");
    const visitorId = searchParams.get("visitorId");

    if (!botId || !visitorId) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND_BOTID_VISITORID",
            message: ERROR_MESSAGE.NOT_FOUND_BOTID_VISITORID,
          },
        },
        { status: 400 }
      );
    }

    const latestSession = await prisma.chatSession.findFirst({
      where: {
        visitorId,
        botId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestSession) {
      return NextResponse.json(
        {
          chatSessionId: latestSession.id,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "SESSION_NOT_FOUND",
          message: ERROR_MESSAGE.SESSION_NOT_FOUND,
        },
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("chat session 조회 에러: ", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR_SESSION,
        },
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { botId, visitorId } = await req.json();

    if (!botId || !visitorId) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND_BOTID_VISITORID",
            message: ERROR_MESSAGE.NOT_FOUND_BOTID_VISITORID,
          },
        },
        { status: 400 }
      );
    }

    const newChatSession = await prisma.chatSession.create({
      data: {
        botId,
        visitorId,
      },
    });

    return NextResponse.json(
      {
        chatSessionId: newChatSession.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("chat session 생성 에러: ", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR_SESSION,
        },
      },
      { status: 500 }
    );
  }
};
