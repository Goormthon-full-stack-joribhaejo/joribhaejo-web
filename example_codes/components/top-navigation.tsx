"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ChevronDown,
  MessageSquare,
  HelpCircle,
  Star,
  TrendingUp,
  ImageIcon
} from "lucide-react"

type UserRole = "guest" | "member"
type ActiveSection = "forum" | "qa" | "study" | "activity" | "news"

interface TopNavigationProps {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

const navigationItems = [
  { id: "forum" as ActiveSection, label: "자유게시판", icon: MessageSquare },
  { id: "qa" as ActiveSection, label: "Q&A", icon: HelpCircle },
  { id: "study" as ActiveSection, label: "스터디", icon: Star },
  { id: "activity" as ActiveSection, label: "대외활동", icon: TrendingUp },
  { id: "news" as ActiveSection, label: "IT 뉴스", icon: ImageIcon },
]

export function TopNavigation({ 
  userRole, 
  setUserRole, 
  activeSection, 
  setActiveSection,
  searchQuery = "",
  onSearchChange
}: TopNavigationProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                하드웨어 커뮤니티
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    activeSection === item.id
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
              <Input
                placeholder="게시글 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-64 bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            )}

            {/* Mobile Search */}
            <Button variant="ghost" size="sm" className="lg:hidden text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
              <Search className="w-4 h-4" />
            </Button>

            {userRole === "guest" ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleRoleChange("member")}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  로그인
                </Button>
                <Button
                  onClick={() => handleRoleChange("member")}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  회원가입
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative text-gray-400 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                  <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-red-500 text-white text-sm">
                          M
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-100 dark:text-gray-100">멤버</p>
                        <p className="text-xs text-gray-400 dark:text-gray-400">커뮤니티 멤버</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700">
                    <DropdownMenuItem className="text-gray-100 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700">
                      <User className="w-4 h-4 mr-2" />내 프로필
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-100 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-2" />
                      설정
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700 dark:bg-gray-700" />
                    <DropdownMenuItem
                      onClick={() => handleRoleChange("guest")}
                      className="text-red-400 dark:text-red-400 hover:bg-gray-700 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-800 dark:border-gray-800 bg-gray-900 dark:bg-gray-900">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-300 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
