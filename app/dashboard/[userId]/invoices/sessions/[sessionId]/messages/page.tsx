"use client";
import { useEffect, use } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatConversation from "@/app/ui/chat/ChatConversation";

const sessionsMessagesPage = ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = use(params);
  const { messages, setMessages } = useChat({
    id: sessionId,
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/api/chat/conversation`,
    }),
  });

  useEffect(() => {
    const loadPrevMessages = async () => {
      try {
        const messagesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/api/chat/${sessionId}/messages`
        );
        const messageData = await messagesResponse.json();

        if (messageData.messages && messageData.messages.length > 0) {
          setMessages(messageData.messages);
        }
      } catch (error) {
        console.error("기존 메시지 로드하기 실패: ", error);
      }
    };

    loadPrevMessages();
  }, [sessionId]);

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-lg font-bold text-gray-500 text-opacity-80">
          대화 내용
        </h2>
      </div>
      <div>
        <ChatConversation messages={messages} status="ready" />
      </div>
    </div>
  );
};

export default sessionsMessagesPage;
