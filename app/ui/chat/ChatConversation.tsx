"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Loader } from "@/components/ai-elements/loader";
import { Fragment } from "react";
import { UIMessage } from "ai";

interface ChatConversationProps {
  messages: UIMessage[];
  status: string;
}

const ChatConversation = ({ messages, status }: ChatConversationProps) => {
  return (
    <Conversation className="h-full">
      <ConversationContent>
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "assistant" &&
              message.parts.filter((part) => part.type === "source-url")
                .length > 0 && (
                <Sources>
                  <SourcesTrigger
                    count={
                      message.parts.filter((part) => part.type === "source-url")
                        .length
                    }
                  />
                  {message.parts
                    .filter((part) => part.type === "source-url")
                    .map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                </Sources>
              )}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <Fragment key={`${message.id}-${i}`}>
                      <Message from={message.role}>
                        <MessageContent>
                          <Response>{part.text}</Response>
                        </MessageContent>
                      </Message>
                    </Fragment>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
        {status === "submitted" && <Loader />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export default ChatConversation;
