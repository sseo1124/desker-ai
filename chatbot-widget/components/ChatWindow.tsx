import React from "react";

interface ChatWindowProps {
  chatId: string;
  apiUrl: string;
}

export default function ChatWindow({ chatId, apiUrl }: ChatWindowProps) {
  return (
    <iframe
      id="desker-ai-chat-window"
      src={`${apiUrl}/chat/${chatId}`}
      className="w-[50vw] h-[70vh] border border-gray-200 rounded-lg shadow-xl z-[9998] transition-all duration-300 ease-out"
      title="Desker AI Chat Window"
    />
  );
}
