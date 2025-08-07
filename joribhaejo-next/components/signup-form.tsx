"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

interface SignupFormProps {
  onRegisterSuccess?: () => void;
}

export function SignupForm({ onRegisterSuccess }: SignupFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다. 로그인 해주세요.",
        variant: "default",
      });
      onRegisterSuccess?.();
      router.push("/"); // 회원가입 성공 후 로그인 페이지로 이동
    },
    onError: (error: any) => {
      console.error("회원가입 실패:", error);
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast({
        title: "입력 오류",
        description: "사용자 이름, 이메일, 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate({ username, email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-100 dark:text-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            회원가입
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                사용자 이름
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자 이름을 입력하세요"
                className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700">
              <UserPlus className="w-4 h-4 mr-2" />
              회원가입
            </Button>
            <p className="text-center text-sm text-gray-400 dark:text-gray-400">
              이미 계정이 있으신가요?{" "}
              <Button variant="link" onClick={() => router.push("/login")} className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                로그인
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
