"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageSquare,
  Flag,
  TrendingUp,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Settings,
} from "lucide-react"

const adminStats = [
  { title: "Total Users", value: "12,847", change: "+5.2%", icon: Users, color: "text-blue-400" },
  { title: "Active Posts", value: "3,421", change: "+12.1%", icon: MessageSquare, color: "text-green-400" },
  { title: "Pending Reports", value: "23", change: "-8.3%", icon: Flag, color: "text-red-400" },
  { title: "Daily Active Users", value: "2,156", change: "+3.7%", icon: TrendingUp, color: "text-yellow-400" },
]

const recentReports = [
  {
    id: 1,
    type: "Spam",
    content: "Repeated promotional posts in GPU discussion",
    reporter: "ModeratorMike",
    reported: "SpamBot123",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "Harassment",
    content: "Inappropriate comments towards other users",
    reporter: "CommunityHelper",
    reported: "ToxicUser456",
    time: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    type: "Off-topic",
    content: "Non-hardware related discussion in CPU forum",
    reporter: "TechMod",
    reported: "RandomPoster",
    time: "1 day ago",
    status: "resolved",
  },
]

const recentUsers = [
  {
    id: 1,
    username: "NewTechie2024",
    email: "newbie@email.com",
    joinDate: "2 hours ago",
    posts: 0,
    status: "active",
  },
  {
    id: 2,
    username: "GamerPro",
    email: "gamer@email.com",
    joinDate: "1 day ago",
    posts: 5,
    status: "active",
  },
  {
    id: 3,
    username: "SuspiciousUser",
    email: "sus@email.com",
    joinDate: "3 days ago",
    posts: 15,
    status: "flagged",
  },
]

export function AdminDashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-400">Manage your community platform</p>
        </div>
        <Button variant="outline" className="border-gray-600 bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminStats.map((stat) => (
              <Card key={stat.title} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                      <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Flag className="w-5 h-5" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            report.type === "Spam"
                              ? "destructive"
                              : report.type === "Harassment"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {report.type}
                        </Badge>
                        <Badge
                          variant={report.status === "pending" ? "outline" : "secondary"}
                          className={report.status === "pending" ? "border-yellow-500 text-yellow-400" : "bg-green-600"}
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400">{report.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{report.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        <span className="text-blue-400">{report.reporter}</span> reported{" "}
                        <span className="text-red-400">{report.reported}</span>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Users className="w-5 h-5" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                          {user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-100">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>Joined {user.joinDate}</span>
                          <span>•</span>
                          <span>{user.posts} posts</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={user.status === "active" ? "secondary" : "destructive"}
                        className={user.status === "active" ? "bg-green-600" : ""}
                      >
                        {user.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-yellow-400">
                          <Ban className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Shield className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 h-12">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 h-12">
                  <Flag className="w-4 h-4 mr-2" />
                  Review Reports
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 h-12">
                  <Settings className="w-4 h-4 mr-2" />
                  Forum Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
