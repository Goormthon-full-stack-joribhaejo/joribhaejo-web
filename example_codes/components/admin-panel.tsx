"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MessageSquare,
  Flag,
  Shield,
  Ban,
  CheckCircle,
  Settings,
  AlertTriangle,
  Activity,
  Database,
} from "lucide-react"

const adminStats = [
  {
    title: "Total Users",
    value: "15,247",
    change: "+8.2%",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    title: "Active Posts",
    value: "4,832",
    change: "+15.3%",
    icon: MessageSquare,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    title: "Pending Reports",
    value: "12",
    change: "-25.0%",
    icon: Flag,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
  },
  {
    title: "Server Load",
    value: "67%",
    change: "+2.1%",
    icon: Activity,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
  },
]

const recentReports = [
  {
    id: 1,
    type: "Spam",
    severity: "high",
    content: "Multiple promotional posts in GPU discussion threads",
    reporter: "ModeratorMike",
    reported: "SpamBot123",
    time: "1 hour ago",
    status: "pending",
  },
  {
    id: 2,
    type: "Harassment",
    severity: "critical",
    content: "Inappropriate and offensive comments towards community members",
    reporter: "CommunityHelper",
    reported: "ToxicUser456",
    time: "3 hours ago",
    status: "pending",
  },
  {
    id: 3,
    type: "Off-topic",
    severity: "low",
    content: "Non-hardware related discussions in CPU forum section",
    reporter: "TechMod",
    reported: "RandomPoster",
    time: "5 hours ago",
    status: "resolved",
  },
]

const systemMetrics = [
  { name: "CPU Usage", value: 45, color: "bg-blue-500" },
  { name: "Memory", value: 67, color: "bg-green-500" },
  { name: "Storage", value: 23, color: "bg-yellow-500" },
  { name: "Network", value: 89, color: "bg-red-500" },
]

export function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your community platform and monitor system health</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300">
              <Database className="w-4 h-4 mr-2" />
              Backup
            </Button>
            <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat) => (
            <Card key={stat.title} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-100 mb-2">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Flag className="w-5 h-5" />
                Recent Reports
                <Badge variant="destructive" className="ml-auto">
                  {recentReports.filter((r) => r.status === "pending").length} Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          report.severity === "critical"
                            ? "destructive"
                            : report.severity === "high"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          report.severity === "critical"
                            ? "bg-red-600"
                            : report.severity === "high"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                        }
                      >
                        {report.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          report.severity === "critical"
                            ? "border-red-500 text-red-400"
                            : report.severity === "high"
                              ? "border-orange-500 text-orange-400"
                              : "border-gray-500 text-gray-400"
                        }
                      >
                        {report.severity}
                      </Badge>
                      <Badge
                        variant={report.status === "pending" ? "outline" : "secondary"}
                        className={
                          report.status === "pending" ? "border-yellow-500 text-yellow-400" : "bg-green-600 text-white"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">{report.time}</span>
                  </div>

                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{report.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <span className="text-blue-400 font-medium">{report.reporter}</span> reported{" "}
                      <span className="text-red-400 font-medium">{report.reported}</span>
                    </div>
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                        >
                          <Ban className="w-3 h-3 mr-1" />
                          Ban User
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Activity className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">{metric.name}</span>
                    <span className="text-sm text-gray-400">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2 bg-gray-700" />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>All systems operational</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last updated: 2 minutes ago</p>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 h-12 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                <span>Manage Users</span>
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 h-12 flex items-center justify-center gap-2">
                <Flag className="w-5 h-5" />
                <span>Review Reports</span>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 h-12 flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                <span>Forum Settings</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 h-12 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>System Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
