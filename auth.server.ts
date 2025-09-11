import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt";
import validator from "validator";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(c) {

      const email = String(c?.email ?? "");
      const validatedEmail = validator.isEmail(email);
      const password = String(c?.password ?? "").trim();

      if (!validatedEmail || !password) return null;
      
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, passwordHash: true },
      });

      if (!user) return null;

      const passwordValid = await bcrypt.compare(password, user.passwordHash);

      if (!passwordValid) return null;

      const chatbot = await prisma.chatbot.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });

      return {
        id: user.id,
        botId: chatbot?.id ?? null,
      };
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.botId = (user as any).botId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).botId = (token as any).botId ?? null;
      }
      return session;
    },
  },
});
