"use client";
import { useState } from "react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      {/* 메시지창 헤더 */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-800">데스커AI 안내원</h3>
      </div>

      {/* 메시지창 목록 영역 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        ) : (
          <div className={`flex "justify-start" mb-4`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100`}
            >
              <div className="whitespace-pre-wrap">
                <div>"대화 메시지"</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 메시지창 입력 영역 */}
      <form
        className="p-3 border-t border-gray-200"
        onSubmit={(e) => {
          e.preventDefault();
          setInput("");
        }}
      >
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={input}
          placeholder="메시지를 입력하세요..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
};

export default ChatBot;
