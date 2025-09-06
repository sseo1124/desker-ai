import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton = ({ onClick }: ChatbotButtonProps) => {
  return (
    <div
      id="desker-ai-chatbot-button"
      onClick={onClick}
      className="w-64 cursor-pointer z-[9999]"
      title="DESKER AI 안내원과 대화하기"
    >
      {/* 오른쪽 챗봇 아이콘 요소 */}
      <DotLottieReact
        src="https://lottie.host/713919f3-956f-47bb-a4c5-0a31ca8de599/Q9myeZVdfR.json"
        loop
        autoplay
      />
    </div>
  );
};

export default ChatbotButton;
