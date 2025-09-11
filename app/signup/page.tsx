import * as React from "react";
import Link from "next/link";
import { Mail, Lock, Phone } from "lucide-react";
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
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const SignupPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/50 to-muted/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            이메일, 비밀번호, 전화번호를 입력해 계정을 만들어 주세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={async (formData) => {
              "use server";

              const email = String(formData.get("email") || "")
                .trim()
                .toLowerCase();
              const password = String(formData.get("password") || "").trim();
              const phoneNumber = String(
                formData.get("phoneNumber") || ""
              ).replace(/\D/g, "");

              const passwordHash = await bcrypt.hash(password, 12);
              await prisma.user.create({
                data: { email, passwordHash, phoneNumber },
              });

              redirect(`/login?email=${encodeURIComponent(email)}`);
            }}
          >
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="010-1234-5678"
                  className="pl-9"
                  required
                  autoComplete="tel"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                로그인 알림 및 계정 복구 등에 사용될 수 있어요.
              </p>
            </div>

            <Button type="submit" className="w-full">
              회원가입
            </Button>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                이미 계정이 있으신가요?
              </span>
              <Link
                href="/login"
                className="underline underline-offset-4 hover:opacity-80"
              >
                로그인
              </Link>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
          <p>
            회원가입을 진행하면{" "}
            <Link href="/terms" className="underline underline-offset-4">
              서비스 약관
            </Link>
            과{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              개인정보 처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
