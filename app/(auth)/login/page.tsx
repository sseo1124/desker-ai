import * as React from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
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
import { signIn } from "@/auth.server";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

const LoginPage = () => {
  const { pending } = useFormStatus();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/50 to-muted/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            계정에 로그인하고 대시보드를 계속하세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              try {
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                await signIn("credentials", {
                  email,
                  password,
                  redirectTo: "/dashboard",
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect("/login");
                }
                throw error;
              }
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-xs underline underline-offset-4 hover:opacity-80"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="/signup"
                  className="text-sm underline underline-offset-4 hover:opacity-80"
                >
                  회원가입
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "로그인 중..." : "로그인"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
          <p>
            로그인함으로써{" "}
            <Link href="/terms" className="underline underline-offset-4">
              서비스 약관
            </Link>
            과{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
