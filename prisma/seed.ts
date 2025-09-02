import {
  PrismaClient,
  MESSAGE_SENDER,
  FEEDBACK_RESULT,
  INQUIRY_STATUS,
  PROCESSING_STATUS,
} from "@/app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started (camelCase version)...");

  console.log("Deleting existing data...");
  await prisma.inquiry.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.chatbot.deleteMany();
  await prisma.user.deleteMany();
  console.log("Existing data deleted.");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "testuser@example.com",
      passwordHash: hashedPassword,
      phoneNumber: "010-1234-5678",
    },
  });
  console.log(`Created user: ${user.email}`);

  const chatbot = await prisma.chatbot.create({
    data: {
      name: "고객 지원 챗봇",
      companyUrl: "https://mycompany.com",
      indexStatus: PROCESSING_STATUS.COMPLETED,
      roleDesc: "이 챗봇은 고객의 질문에 친절하게 답변하는 역할을 합니다.",
      owner: {
        connect: { id: user.id },
      },
    },
  });
  console.log(`Created chatbot: ${chatbot.name}`);

  const session1 = await prisma.chatSession.create({
    data: {
      visitorId: "visitor-uuid-1111-aaaa",
      bot: {
        connect: { id: chatbot.id },
      },
      messages: {
        create: [
          {
            sender: MESSAGE_SENDER.VISITOR,
            content: "안녕하세요, 제품 배송 문의 좀 하려구요.",
          },
          {
            sender: MESSAGE_SENDER.AI,
            content: "네, 안녕하세요! 주문번호를 알려주시겠어요?",
          },
          {
            sender: MESSAGE_SENDER.VISITOR,
            content: "주문번호는 KR-12345 입니다.",
          },
          {
            sender: MESSAGE_SENDER.AI,
            content:
              "확인 결과, 고객님의 상품은 오늘 출고될 예정입니다. 도움이 되셨나요?",
            feedbackResult: FEEDBACK_RESULT.HELPFUL, // camelCase로 변경
          },
        ],
      },
    },
  });
  console.log(`Created chat session with ID: ${session1.id}`);

  const inquiry1 = await prisma.inquiry.create({
    data: {
      name: "김민준",
      phoneNumber: "010-1111-2222",
      email: "minjun.kim@example.com",
      message:
        "배송이 너무 늦어지는 것 같아 문의 남깁니다. 빠른 확인 부탁드려요.",
      status: INQUIRY_STATUS.UNREAD,
      bot: {
        connect: { id: chatbot.id },
      },
      session: {
        connect: { id: session1.id },
      },
    },
  });
  console.log(`Created inquiry linked to session: ${inquiry1.id}`);

  const session2 = await prisma.chatSession.create({
    data: {
      visitorId: "visitor-uuid-2222-bbbb",
      isRead: true,
      bot: {
        connect: { id: chatbot.id },
      },
      messages: {
        create: [
          {
            sender: MESSAGE_SENDER.VISITOR,
            content: "환불 정책이 어떻게 되나요?",
          },
          {
            sender: MESSAGE_SENDER.AI,
            content:
              "환불은 상품 수령 후 7일 이내에 가능하며, 웹사이트의 마이페이지에서 신청하실 수 있습니다.",
          },
        ],
      },
    },
  });
  console.log(`Created chat session with ID: ${session2.id}`);

  const inquiry2 = await prisma.inquiry.create({
    data: {
      name: "이서연",
      phoneNumber: "010-3333-4444",
      email: "seoyeon.lee@example.com",
      companyName: "테스트 컴퍼니",
      message:
        "서비스 제휴 관련으로 문의드립니다. 담당자분 연락처를 알 수 있을까요?",
      status: INQUIRY_STATUS.READ,
      bot: {
        connect: { id: chatbot.id },
      },
    },
  });
  console.log(`Created standalone inquiry: ${inquiry2.id}`);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 스크립트 종료 시 Prisma 클라이언트 연결을 해제합니다.
    await prisma.$disconnect();
  });
