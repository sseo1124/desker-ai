import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect } from "react";

interface ChatWindowProps {
  chatId: string;
  apiUrl: string;
}

const ChatWindow = ({ chatId, apiUrl }: ChatWindowProps) => {
  return (
    <iframe
      id="desker-ai-chat-window"
      src={`${apiUrl}/chat/${chatId}`}
      className="w-[50vw] h-[70vh] border border-gray-200 rounded-lg shadow-xl z-[9998] transition-all duration-300 ease-out"
      title="Desker AI Chat Window"
    />
  );
};

export default ChatWindow;
