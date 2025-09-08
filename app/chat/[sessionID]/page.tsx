"use client";
import ChatConversation from "@/app/ui/chat/ChatConversation";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { useState, useEffect, use } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";

const ChatBot = ({ params }: { params: Promise<{ sessionID: string }> }) => {
  const { sessionID } = use(params);

  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage, status } = useChat({
    id: sessionID,
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/api/chat/conversation`,
    }),
  });

  useEffect(() => {
    const loadPrevMessages = async () => {
      try {
        const messagesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/api/chat/${sessionID}/messages`
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
  }, [sessionID]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <ChatConversation messages={messages} status={status} />
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            placeholder="회사관련 궁금한 정보 저한테 물어보세요"
            value={input}
          />
          <PromptInputToolbar className="flex justify-end">
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBot;
