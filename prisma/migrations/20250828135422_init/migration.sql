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
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chatbot" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role_desc" TEXT,
    "keyword_reply_rules" JSONB,
    "conversation_rules" JSONB,
    "company_url" TEXT,
    "index_status" "public"."PROCESSING_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatSession" (
    "id" SERIAL NOT NULL,
    "session_uuid" TEXT NOT NULL,
    "bot_id" INTEGER NOT NULL,
    "visitor_id" VARCHAR(128) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMessage" (
    "id" BIGSERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "sender" "public"."MESSAGE_SENDER" NOT NULL,
    "sender_key" VARCHAR(128),
    "content" TEXT,
    "feedback_result" "public"."FEEDBACK_RESULT",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inquiry" (
    "id" SERIAL NOT NULL,
    "bot_id" INTEGER NOT NULL,
    "session_id" INTEGER,
    "name" VARCHAR(120),
    "company_name" VARCHAR(255),
    "phone_number" VARCHAR(32),
    "email" VARCHAR(255),
    "message" TEXT NOT NULL,
    "status" "public"."INQUIRY_STATUS" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSession_session_uuid_key" ON "public"."ChatSession"("session_uuid");

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
