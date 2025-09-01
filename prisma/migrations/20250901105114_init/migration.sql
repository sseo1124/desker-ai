-- CreateEnum
CREATE TYPE "public"."PROCESSING_STATUS" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."MESSAGE_SENDER" AS ENUM ('AI', 'VISITOR');

-- CreateEnum
CREATE TYPE "public"."FEEDBACK_RESULT" AS ENUM ('HELPFUL', 'UNHELPFUL');

-- CreateEnum
CREATE TYPE "public"."INQUIRY_STATUS" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chatbot" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role_desc" TEXT,
    "keyword_reply_rules" JSONB,
    "conversation_rules" JSONB,
    "company_url" TEXT NOT NULL,
    "index_status" "public"."PROCESSING_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatSession" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "visitor_id" VARCHAR(128) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMessage" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "sender" "public"."MESSAGE_SENDER" NOT NULL,
    "sender_key" VARCHAR(128),
    "content" TEXT,
    "feedback_result" "public"."FEEDBACK_RESULT",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inquiry" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "session_id" TEXT,
    "name" VARCHAR(120) NOT NULL,
    "company_name" VARCHAR(255),
    "phone_number" VARCHAR(32) NOT NULL,
    "email" VARCHAR(255),
    "message" TEXT NOT NULL,
    "status" "public"."INQUIRY_STATUS" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Chatbot_user_id_idx" ON "public"."Chatbot"("user_id");

-- CreateIndex
CREATE INDEX "ChatSession_bot_id_idx" ON "public"."ChatSession"("bot_id");

-- CreateIndex
CREATE INDEX "ChatMessage_session_id_idx" ON "public"."ChatMessage"("session_id");

-- CreateIndex
CREATE INDEX "Inquiry_bot_id_idx" ON "public"."Inquiry"("bot_id");

-- CreateIndex
CREATE INDEX "Inquiry_session_id_idx" ON "public"."Inquiry"("session_id");

-- AddForeignKey
ALTER TABLE "public"."Chatbot" ADD CONSTRAINT "Chatbot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatSession" ADD CONSTRAINT "ChatSession_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."Chatbot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."Chatbot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inquiry" ADD CONSTRAINT "Inquiry_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
