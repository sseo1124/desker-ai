import {
  PrismaClient,
  PROCESSING_STATUS,
  MESSAGE_SENDER,
  FEEDBACK_RESULT,
  INQUIRY_STATUS,
} from "@/app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log(`seeding 시작...`);

  const usersData = [
    { email: "ceo@mycompany.com", phone_number: "010-1234-5678" },
    { email: "manager@shop.com", phone_number: "010-2222-3333" },
    { email: "owner@cafe.com", phone_number: "010-4444-5555" },
    { email: "info@agency.dev", phone_number: "010-6666-7777" },
    { email: "contact@service.io", phone_number: "010-8888-9999" },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: { ...u, password_hash: hashedPassword },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} users 생성`);

  const chatbotsData = [
    {
      user_id: createdUsers[0].id,
      name: "MyCompany AI 안내원",
      company_url: "https://mycompany.com",
      index_status: PROCESSING_STATUS.COMPLETED,
    },
    {
      user_id: createdUsers[1].id,
      name: "온라인 쇼핑몰 CS봇",
      company_url: "https://shop.com/faq",
      index_status: PROCESSING_STATUS.COMPLETED,
    },
    {
      user_id: createdUsers[2].id,
      name: "카페 이벤트 안내봇",
      company_url: "https://cafe-seoul.com/events",
      index_status: PROCESSING_STATUS.PENDING,
    },
    {
      user_id: createdUsers[3].id,
      name: "에이전시 포트폴리오 봇",
      company_url: "https://agency.dev/projects",
      index_status: PROCESSING_STATUS.PROCESSING,
    },
    {
      user_id: createdUsers[0].id,
      name: "MyCompany 기술지원 봇",
      company_url: "https://mycompany.com/docs",
      index_status: PROCESSING_STATUS.FAILED,
    },
  ];

  const createdChatbots = [];
  for (const c of chatbotsData) {
    const chatbot = await prisma.chatbot.create({ data: c });
    createdChatbots.push(chatbot);
  }
  console.log(`✅ ${createdChatbots.length} chatbots 생성`);

  const sessionsData = [
    {
      bot_id: createdChatbots[0].id,
      visitor_id: "visitor-001",
      is_read: false,
    },
    { bot_id: createdChatbots[1].id, visitor_id: "visitor-002", is_read: true },
    {
      bot_id: createdChatbots[1].id,
      visitor_id: "visitor-003",
      is_read: false,
    },
    { bot_id: createdChatbots[2].id, visitor_id: "visitor-004", is_read: true },
    {
      bot_id: createdChatbots[0].id,
      visitor_id: "visitor-005",
      is_read: false,
    },
    {
      bot_id: createdChatbots[4].id,
      visitor_id: "visitor-006",
      is_read: false,
    },
  ];

  const createdSessions = [];
  for (const s of sessionsData) {
    const session = await prisma.chatSession.create({ data: s });
    createdSessions.push(session);
  }
  console.log(`✅ ${createdSessions.length} chat sessions 생성`);

  const messagesData = [
    {
      session_id: createdSessions[0].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "배송 규정 알려주세요.",
    },
    {
      session_id: createdSessions[0].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "안녕하세요! 저희 MyCompany의 배송 규정에 대해 알려드릴게요. 기본 배송은 영업일 기준 3일이 소요됩니다.",
      feedback_result: FEEDBACK_RESULT.HELPFUL,
    },
    {
      session_id: createdSessions[0].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "제주도인데, 추가 비용이 있나요?",
    },
    {
      session_id: createdSessions[0].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "네, 제주도 및 도서산간 지역은 3,000원의 추가 배송비가 발생할 수 있습니다.",
    },
    {
      session_id: createdSessions[0].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "알겠습니다. 감사합니다.",
    },
    {
      session_id: createdSessions[1].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "환불 가능한가요?",
    },
    {
      session_id: createdSessions[1].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "죄송합니다. 제가 답변하기 어려운 질문이네요. 담당자에게 문의하시겠어요?",
      feedback_result: FEEDBACK_RESULT.UNHELPFUL,
    },
    {
      session_id: createdSessions[1].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "네 연결해주세요.",
    },
    {
      session_id: createdSessions[2].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "혹시 파란색 스웨터 재고 있나요?",
    },
    {
      session_id: createdSessions[2].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "네, 고객님. 문의하신 파란색 스웨터(L 사이즈)는 현재 5개 남아있습니다.",
    },
    {
      session_id: createdSessions[2].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "M 사이즈는요?",
    },
    {
      session_id: createdSessions[2].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "M 사이즈는 아쉽게도 현재 품절 상태입니다. 재입고 알림을 신청하시겠어요?",
    },
    {
      session_id: createdSessions[2].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "아니요 괜찮아요.",
    },
    {
      session_id: createdSessions[3].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "이번 달 이벤트가 뭔가요?",
    },
    {
      session_id: createdSessions[3].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "8월 한 달간 모든 커피 원두 구매 시 드립백 1개를 증정하는 이벤트를 진행하고 있습니다!",
      feedback_result: FEEDBACK_RESULT.HELPFUL,
    },
    {
      session_id: createdSessions[4].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "API 연동 문서는 어디서 볼 수 있나요?",
    },
    {
      session_id: createdSessions[4].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "개발자 문서는 [링크]에서 확인하실 수 있습니다. 더 궁금한 점이 있으신가요?",
    },
    {
      session_id: createdSessions[4].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "아니요, 확인해보겠습니다.",
    },
    {
      session_id: createdSessions[5].id,
      sender: MESSAGE_SENDER.VISITOR,
      content: "비밀번호를 잃어버렸어요.",
    },
    {
      session_id: createdSessions[5].id,
      sender: MESSAGE_SENDER.AI,
      content:
        "제가 도와드릴 수 없는 부분이네요. 담당자에게 문의를 남겨주시겠어요?",
    },
  ];

  await prisma.chatMessage.createMany({ data: messagesData });
  console.log(`✅ ${messagesData.length} chat messages 생성`);

  const inquiriesData = [
    {
      bot_id: createdChatbots[1].id,
      session_id: createdSessions[1].id,
      name: "박영희",
      email: "younghee@test.com",
      message: "환불 규정에 대해 더 자세히 알고 싶어요.",
      status: INQUIRY_STATUS.UNREAD,
    },
    {
      bot_id: createdChatbots[0].id,
      session_id: createdSessions[0].id,
      name: "이민준",
      email: "minjun@test.com",
      message: "대량 구매 견적 문의드립니다.",
      status: INQUIRY_STATUS.UNREAD,
    },
    {
      bot_id: createdChatbots[1].id,
      session_id: createdSessions[2].id,
      name: "최지우",
      email: "jiwoo@test.com",
      message: "제품 A/S는 어떻게 받나요?",
      status: INQUIRY_STATUS.READ,
    },
    {
      bot_id: createdChatbots[2].id,
      session_id: createdSessions[3].id,
      name: "정서윤",
      email: "seoyun@test.com",
      message: "이벤트 참여 방법을 문의합니다.",
      status: INQUIRY_STATUS.ARCHIVED,
    },
    {
      bot_id: createdChatbots[4].id,
      session_id: createdSessions[5].id,
      name: "강하준",
      email: "hajun@test.com",
      message: "기술 지원팀 연결 부탁드립니다.",
      status: INQUIRY_STATUS.UNREAD,
    },
  ];

  await prisma.inquiry.createMany({ data: inquiriesData });
  console.log(`✅ ${inquiriesData.length} inquiries 생성`);

  console.log(`Seeding 끝`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
