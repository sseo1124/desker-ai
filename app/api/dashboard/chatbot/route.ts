import { ERROR_MESSAGE } from "@/config/constants";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PROCESSING_STATUS } from "@/app/generated/prisma";

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

  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: { userId },
    });

    if (chatbot) {
      return NextResponse.json(chatbot, { status: 200 });
    } else {
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
  } catch (error) {
    console.error("Error fetching chatbot settings:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR_CHATBOT",
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR_CHATBOT,
        },
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  const { userId } = await req.json();

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

  try {
    const newChatbot = await prisma.chatbot.create({
      data: {
        userId,
      },
    });
    return NextResponse.json(newChatbot, { status: 201 });
  } catch (error) {
    console.error("Error creating chatbot:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR_CHATBOT_CREATION,
        },
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  const {
    botId,
    name,
    roleDesc,
    companyUrl,
    keywordReplyRules,
    conversationRules,
  } = await req.json();

  if (!botId) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND_BOTID",
          message: ERROR_MESSAGE.NOT_FOUND_BOTID_VISITORID,
        },
      },
      { status: 400 }
    );
  }

  try {
    await prisma.chatbot.update({
      where: { id: botId },
      data: {
        name,
        roleDesc,
        companyUrl,
        keywordReplyRules,
        conversationRules,
        indexStatus: PROCESSING_STATUS.PROCESSING,
      },
    });
    // TODO: 여기에 크롤링과 vectorDB 저장 API를 호출하는 로직을 추가할 수 있습니다.
    // 예: await startCrawling(companyUrl);

    const updatedChatbot = await prisma.chatbot.update({
      where: { id: botId },
      data: {
        indexStatus: PROCESSING_STATUS.COMPLETED,
      },
    });

    return NextResponse.json(updatedChatbot, { status: 200 });
  } catch (error) {
    console.error("Error updating chatbot:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR_UPDATE",
          message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR_CHATBOT_UPDATE,
        },
      },
      { status: 500 }
    );
  }
};
