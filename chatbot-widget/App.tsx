import React, { useEffect, useState } from "react";
import ChatbotWidget from "@/chatbot-widget/components/ChatbotButton";
import ChatWindow from "@/chatbot-widget/components/ChatWindow";
import { getOrSetVisitorId } from "@/chatbot-widget/lib/visitor";

interface AppProps {
  chatbotConfig: {
    botId: string;
    apiBaseURL: string;
  };
}

const App = ({ chatbotConfig }: AppProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSessionId, setChatSessionId] = useState("");
  const { botId, apiBaseURL } = chatbotConfig;
  const visitorId = getOrSetVisitorId();

  useEffect(() => {
    if (chatSessionId || !visitorId || !botId || !apiBaseURL) {
      if (visitorId && botId && apiBaseURL) {
        setIsLoading(false);
      }
      return;
    }

    const initializeChatSession = async () => {
      try {
        const responseToGetSession = await fetch(
          `${apiBaseURL}/api/chat/session?botId=${botId}&visitorId=${visitorId}`
        );

        if (responseToGetSession.ok) {
          const chatSessionData = await responseToGetSession.json();
          setChatSessionId(chatSessionData.chatSessionId);
          return;
        }

        if (responseToGetSession.status === 404) {
          const responseToCreateSession = await fetch(
            `${apiBaseURL}/api/chat/session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ botId, visitorId }),
            }
          );

          const chatSessionData = await responseToCreateSession.json();
          setChatSessionId(chatSessionData.chatSessionId);
        }
      } catch (error) {
        console.error("세션 초기화 실패: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChatSession();
  }, [visitorId, botId, apiBaseURL]);

  const handleWidgetClick = () => {
    if (isLoading) {
      return;
    }

    if (isChatOpen) {
      setIsChatOpen(false);
      return;
    }

    setIsChatOpen(true);
  };

  return (
    <div className="fixed bottom-7 right-5 flex flex-col items-end p-5 z-[9997]">
      {isChatOpen && <ChatWindow chatId={chatSessionId} apiUrl={apiBaseURL} />}
      <ChatbotWidget onClick={handleWidgetClick}></ChatbotWidget>
    </div>
  );
};

export default App;
