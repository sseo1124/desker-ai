"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ai-elements/code-block";
import { use, useEffect, useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { PROCESSING_STATUS } from "@/app/generated/prisma";
import { CHATBOT_DFAULT_VALUE } from "@/config/constants";

type Chatbot = {
  id: string;
  name: string | null;
  companyUrl: string | null;
  roleDesc: string | null;
  keywordReplyRules: string | null;
  conversationRules: string | null;
  indexStatus: PROCESSING_STATUS;
};

const ChatbotSetting = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { userId } = use(params);
  const installationScript = `
<script
  src="${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/chatbot-widget/loader.js"
  data-bot-id="${chatbot?.id || ""}"
  async
></script>
`.trim();

  useEffect(() => {
    const fetchChatbot = async () => {
      setIsInitialLoading(true);

      try {
        const chatbotResponse = await fetch(
          `/api/dashboard/chatbot?userId=${userId}`
        );

        if (chatbotResponse.ok) {
          const data = await chatbotResponse.json();
          setChatbot(data);
          return;
        }

        if (chatbotResponse.status === 404) {
          const postResponse = await fetch("/api/dashboard/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (postResponse.ok) {
            const newData = await postResponse.json();
            setChatbot(newData);
          } else {
            console.error("챗봇 생성 실패 에러:", await postResponse.json());
          }
        } else {
          console.error(
            "chatbot 가져오기 실패 에러:",
            await chatbotResponse.json()
          );
        }
      } catch (error) {
        console.error("chabot 초기화 실패 에러", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchChatbot();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!chatbot) return;
    const { id, value } = e.target;
    setChatbot((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleTrainClick = async () => {
    if (!chatbot) return;

    setChatbot((prev) =>
      prev ? { ...prev, indexStatus: PROCESSING_STATUS.PROCESSING } : null
    );

    try {
      const response = await fetch("/api/dashboard/chatbot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: chatbot.id,
          name: chatbot.name,
          roleDesc: chatbot.roleDesc,
          companyUrl: chatbot.companyUrl,
          keywordReplyRules: chatbot.keywordReplyRules,
          conversationRules: chatbot.conversationRules,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setChatbot(updatedData);
      } else {
        console.error("chatbot 업데이트 실패:", await response.json());
        setChatbot((prev) =>
          prev ? { ...prev, indexStatus: PROCESSING_STATUS.PENDING } : null
        );
      }
    } catch (error) {
      console.error("챗봇 학습 중 에러발생:", error);
      setChatbot((prev) =>
        prev ? { ...prev, indexStatus: PROCESSING_STATUS.PENDING } : null
      );
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        챗봇 설정 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        챗봇 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">AI 챗봇 설정</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 왼쪽: 설정 카드 */}
        <div className="lg:col-span-2 space-y-8  max-h-[calc(100vh-12rem)] overflow-y-auto pr-6">
          <Card>
            <CardHeader>
              <CardTitle>데스커 기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 border-t">
              <div className="space-y-2">
                <Label>프로필</Label>
                <div className="flex items-center gap-4">
                  <Image
                    src="/desker-icon.png"
                    width={64}
                    height={64}
                    alt="Desker Logo"
                    className="rounded-full border"
                  />
                  <Input
                    id="name"
                    value={chatbot.name || ""}
                    onChange={handleInputChange}
                    placeholder={CHATBOT_DFAULT_VALUE.NAME}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyUrl">회사 홈페이지 URL</Label>
                <Input
                  id="companyUrl"
                  value={chatbot.companyUrl || ""}
                  onChange={handleInputChange}
                  placeholder={CHATBOT_DFAULT_VALUE.COMPANY_URL}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDesc">역할 설명</Label>
                <Textarea
                  id="roleDesc"
                  value={chatbot.roleDesc || ""}
                  onChange={handleInputChange}
                  placeholder={CHATBOT_DFAULT_VALUE.ROLE_DESCRIPTION}
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywordReplyRules">키워드 답변 규칙</Label>
                <Textarea
                  id="keywordReplyRules"
                  value={chatbot.keywordReplyRules || ""}
                  onChange={handleInputChange}
                  placeholder={CHATBOT_DFAULT_VALUE.CONVERSATION_RULE}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversationRules">대화 규칙 설정</Label>
                <Textarea
                  id="conversationRules"
                  value={chatbot.conversationRules || ""}
                  onChange={handleInputChange}
                  placeholder={CHATBOT_DFAULT_VALUE.KEYWORD_REPLY_RULE}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleTrainClick}
                  disabled={
                    chatbot.indexStatus === PROCESSING_STATUS.PROCESSING
                  }
                >
                  {chatbot.indexStatus === PROCESSING_STATUS.PROCESSING
                    ? "학습 중..."
                    : "데스커 AI 학습"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>간단 안내원 챗봇 설치</CardTitle>
            </CardHeader>
            {chatbot.indexStatus === PROCESSING_STATUS.COMPLETED && (
              <CardContent className="space-y-4 border-t pt-6">
                <h3 className="font-semibold">Web 설치하기</h3>
                <p className="text-sm text-muted-foreground">
                  복사/붙여넣기 설치 코드
                </p>
                <CodeBlock code={installationScript} language="html">
                  <CodeBlockCopyButton />
                </CodeBlock>
                <div>
                  <h4 className="font-semibold mb-2">설치 가이드 보기</h4>
                  <Image
                    src="/information-section-image.png"
                    width={400}
                    height={266}
                    alt="Installation Guide"
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* 오른쪽: 모의 채팅방 */}
        <div className="lg:col-span-1">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                <CardDescription>
                  {`${chatbot.name} 안내원 여러분을 돕기 위해 기다리고 있어요`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 bg-gray-200 dark:bg-gray-900 overflow-y-auto">
              <div className="space-y-4">
                <Message from="assistant" className="py-2">
                  <MessageContent>
                    안녕하세요. 저는 {chatbot.name || "AI"} 입니다. <br />
                    고객이 궁금해 할만한 질문을 해보세요.
                  </MessageContent>
                  <Avatar className="size-8">
                    <AvatarImage src="/desker-icon.png" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </Message>

                <Message from="user" className="py-2">
                  <MessageContent>
                    바닐라 코딩은 어떤 부트캠프를 제공하는 곳이야?
                  </MessageContent>
                </Message>

                <Message from="assistant" className="py-2">
                  <MessageContent>
                    아시아에서 가장 최고의 개발자 부트캠프야
                  </MessageContent>
                  <Avatar className="size-8">
                    <AvatarImage src="/desker-icon.png" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </Message>
              </div>
            </CardContent>
            <CardFooter className="p-2 border-t">
              <Input
                disabled
                placeholder={`${chatbot.name || "AI"}에게 질문해 보세요.`}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSetting;
