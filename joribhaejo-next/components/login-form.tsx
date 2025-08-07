"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast" // Assuming useToast is available
import { authApi, userApi } from "@/lib/api"
import { ApiError } from "@/lib/api" // ApiError 임포트 추가

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("") // 에러 메시지 상태 추가
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("") // 로그인 시도 시 에러 메시지 초기화

    try {
      const data = await authApi.login({ email, password })
      console.log("Attempting to set accessToken:", data.accessToken); // 이 줄 추가
      localStorage.setItem("accessToken", data.accessToken)

      // 현재 사용자 정보 가져오기
      const currentUser = await userApi.getCurrentUser()
      localStorage.setItem("currentUser", JSON.stringify(currentUser)) // 사용자 정보를 JSON 문자열로 저장
      
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })
      onLoginSuccess?.()

    } catch (error: any) {
      if (error instanceof ApiError) {
        setErrorMessage(`로그인이 실패했습니다. (${error.status})`) // 상태 코드를 포함한 메시지 출력
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다.") // 기타 오류 메시지 설정
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-100 dark:text-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">이메일 또는 계정</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 또는 계정을 입력하세요"
                className="bg-gray-700 dark:bg-gray-700 border-gray-600 dark:border-gray-600 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
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
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
