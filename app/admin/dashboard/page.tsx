"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, TrendingUp, Award, AlertTriangle, UserCheck, Calendar, BarChart3, Settings, Shield } from "lucide-react"

// Mock admin dashboard data
const mockAdminData = {
  stats: {
    totalUsers: 1247,
    activeMentors: 89,
    activeMentees: 234,
    activePrograms: 156,
    completedPrograms: 89,
    pendingApplications: 23,
    averageRating: 4.7,
    successRate: 87,
  },
  recentUsers: [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "mentee",
      joinDate: "2024-02-10",
      status: "active",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "mentor",
      joinDate: "2024-02-09",
      status: "pending",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      role: "mentee",
      joinDate: "2024-02-08",
      status: "active",
    },
  ],
  programStats: [
    {
      duration: "3 months",
      active: 45,
      completed: 23,
      successRate: 89,
    },
    {
      duration: "6 months",
      active: 78,
      completed: 45,
      successRate: 91,
    },
    {
      duration: "12 months",
      active: 33,
      completed: 21,
      successRate: 82,
    },
  ],
  alerts: [
    {
      id: "1",
      type: "warning",
      message: "5 mentors have not logged in for over 30 days",
      date: "2024-02-10",
    },
    {
      id: "2",
      type: "info",
      message: "New mentor applications require review",
      date: "2024-02-09",
    },
  ],
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "admin") {
    router.push("/")
    return null
  }

  const { stats, recentUsers, programStats, alerts } = mockAdminData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "mentor":
        return "bg-blue-100 text-blue-800"
      case "mentee":
        return "bg-green-100 text-green-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-xl text-gray-600">Manage users, programs, and platform activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMentors}</p>
                    <p className="text-sm text-gray-600">Active Mentors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeMentees}</p>
                    <p className="text-sm text-gray-600">Active Mentees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activePrograms}</p>
                    <p className="text-sm text-gray-600">Active Programs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Platform Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{stats.averageRating}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{stats.completedPrograms}</p>
                      <p className="text-sm text-gray-600">Completed Programs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Program Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Program Statistics
                  </CardTitle>
                  <CardDescription>Performance metrics by program duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programStats.map((program, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{program.duration} Programs</h4>
                          <Badge variant="secondary">{program.successRate}% success rate</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Active</p>
                            <p className="font-semibold text-blue-600">{program.active}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Completed</p>
                            <p className="font-semibold text-green-600">{program.completed}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="font-semibold">{program.active + program.completed}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                  <CardDescription>Newly registered users requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gray-100 text-gray-700">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">{alert.message}</p>
                        <p className="text-xs text-yellow-600 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/programs")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Review Programs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Reviews</span>
                    <span className="font-semibold">{stats.pendingApplications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold">1.2s</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
