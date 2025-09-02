"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Edit, Trash2, Mail } from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "mentor",
    status: "active",
    joinDate: "2023-08-15",
    lastLogin: "2024-02-10",
    programs: 3,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "mentee",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "2024-02-09",
    programs: 1,
    rating: null,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    role: "mentor",
    status: "inactive",
    joinDate: "2023-12-01",
    lastLogin: "2024-01-15",
    programs: 2,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "mentee",
    status: "pending",
    joinDate: "2024-02-08",
    lastLogin: "2024-02-08",
    programs: 0,
    rating: null,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    role: "mentor",
    status: "active",
    joinDate: "2023-09-20",
    lastLogin: "2024-02-11",
    programs: 4,
    rating: 4.8,
  },
]

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "admin") {
    router.push("/")
    return null
  }

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesStatus = statusFilter === "all" || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
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

  const handleUserAction = (userId: string, action: string) => {
    console.log("[v0] User action:", { userId, action })
    // In real app, this would update the database
  }

  const userStats = {
    total: mockUsers.length,
    mentors: mockUsers.filter((u) => u.role === "mentor").length,
    mentees: mockUsers.filter((u) => u.role === "mentee").length,
    active: mockUsers.filter((u) => u.status === "active").length,
    pending: mockUsers.filter((u) => u.status === "pending").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-xl text-gray-600">Manage platform users and their access</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-blue-600">{userStats.mentors}</p>
                <p className="text-sm text-gray-600">Mentors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-green-600">{userStats.mentees}</p>
                <p className="text-sm text-gray-600">Mentees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-emerald-600">{userStats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-yellow-600">{userStats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="mentor">Mentors</SelectItem>
                    <SelectItem value="mentee">Mentees</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="text-center">
                        <p className="font-medium">{user.programs}</p>
                        <p className="text-xs">Programs</p>
                      </div>

                      {user.rating && (
                        <div className="text-center">
                          <p className="font-medium">{user.rating}</p>
                          <p className="text-xs">Rating</p>
                        </div>
                      )}

                      <div className="text-center">
                        <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                        <p className="text-xs">Joined</p>
                      </div>

                      <div className="text-center">
                        <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                        <p className="text-xs">Last Login</p>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage {user.name}</DialogTitle>
                            <DialogDescription>User actions and account management</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Role</p>
                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Status</p>
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Programs</p>
                                <p className="text-sm text-gray-600">{user.programs}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, "edit")}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, "message")}
                                className="flex items-center gap-2"
                              >
                                <Mail className="h-3 w-3" />
                                Message
                              </Button>

                              {user.status === "active" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, "suspend")}
                                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <UserX className="h-3 w-3" />
                                  Suspend
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user.id, "activate")}
                                  className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <UserCheck className="h-3 w-3" />
                                  Activate
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserAction(user.id, "delete")}
                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
