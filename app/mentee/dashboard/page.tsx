"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  Star,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react"

// Mock dashboard data
const mockDashboardData = {
  currentProgram: {
    mentor: "Sarah Johnson",
    mentorEmail: "sarah@example.com",
    programName: "6-month Technical Leadership Track",
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    progress: 65,
    nextSession: "2024-02-15T14:00:00",
    totalSessions: 12,
    completedSessions: 8,
  },
  milestones: [
    {
      id: "1",
      title: "Technical Foundation",
      description: "Master core technical concepts and best practices",
      status: "completed",
      completedDate: "2024-01-30",
      feedback: "Excellent progress on system design fundamentals. Ready to move to advanced topics.",
    },
    {
      id: "2",
      title: "Leadership Basics",
      description: "Learn fundamental leadership and communication skills",
      status: "completed",
      completedDate: "2024-02-10",
      feedback: "Great improvement in communication skills and team collaboration.",
    },
    {
      id: "3",
      title: "Project Management",
      description: "Apply project management principles to real scenarios",
      status: "in-progress",
      progress: 70,
    },
    {
      id: "4",
      title: "Advanced System Design",
      description: "Design scalable systems and architecture",
      status: "upcoming",
    },
    {
      id: "5",
      title: "Team Leadership",
      description: "Lead a team project and manage stakeholders",
      status: "upcoming",
    },
    {
      id: "6",
      title: "Career Planning",
      description: "Create a strategic career development plan",
      status: "upcoming",
    },
  ],
  goals: [
    {
      id: "1",
      title: "Become Senior Engineer",
      description: "Get promoted to senior engineer role within 6 months",
      status: "in-progress",
      progress: 60,
    },
    {
      id: "2",
      title: "Learn System Design",
      description: "Master system design principles and patterns",
      status: "in-progress",
      progress: 80,
    },
    {
      id: "3",
      title: "Improve Leadership Skills",
      description: "Develop leadership and mentoring capabilities",
      status: "in-progress",
      progress: 45,
    },
  ],
  recentFeedback: [
    {
      id: "1",
      milestone: "Leadership Basics",
      feedback:
        "Great improvement in communication skills and team collaboration. Continue practicing active listening.",
      date: "2024-02-10",
      rating: 5,
    },
    {
      id: "2",
      milestone: "Technical Foundation",
      feedback: "Excellent progress on system design fundamentals. Ready to move to advanced topics.",
      date: "2024-01-30",
      rating: 5,
    },
  ],
}

export default function MenteeDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "mentee") {
    router.push("/")
    return null
  }

  const { currentProgram, milestones, goals, recentFeedback } = mockDashboardData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "upcoming":
        return <Target className="h-4 w-4 text-gray-600" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name}</h1>
            <p className="text-xl text-gray-600">Track your mentorship progress and goals</p>
          </div>

          {/* Current Program Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                        {currentProgram.mentor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{currentProgram.programName}</h3>
                      <p className="text-gray-600">with {currentProgram.mentor}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(currentProgram.startDate).toLocaleDateString()} -{" "}
                        {new Date(currentProgram.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Program Progress</span>
                        <span>{currentProgram.progress}%</span>
                      </div>
                      <Progress value={currentProgram.progress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sessions Completed:</span>
                        <span className="font-medium ml-2">
                          {currentProgram.completedSessions}/{currentProgram.totalSessions}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Session:</span>
                        <span className="font-medium ml-2">
                          {new Date(currentProgram.nextSession).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Mentor
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    View Mentor Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Program Milestones
                  </CardTitle>
                  <CardDescription>Track your progress through key learning objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(milestone.status)}
                            <div>
                              <h4 className="font-semibold">{milestone.title}</h4>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace("-", " ")}
                          </Badge>
                        </div>

                        {milestone.status === "in-progress" && milestone.progress && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-2" />
                          </div>
                        )}

                        {milestone.status === "completed" && milestone.feedback && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-green-800 mb-1">
                              <strong>Feedback:</strong> {milestone.feedback}
                            </p>
                            <p className="text-xs text-green-600">
                              Completed on {new Date(milestone.completedDate!).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Personal Goals
                  </CardTitle>
                  <CardDescription>Your individual career development objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                          <Badge className={getStatusColor(goal.status)}>{goal.status.replace("-", " ")}</Badge>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFeedback.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{feedback.milestone}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">{feedback.feedback}</p>
                        <p className="text-xs text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/applications")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/mentors")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Browse Mentors
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Program Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Milestones Completed</span>
                    <span className="font-semibold">2/6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessions Attended</span>
                    <span className="font-semibold">
                      {currentProgram.completedSessions}/{currentProgram.totalSessions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Remaining</span>
                    <span className="font-semibold">
                      {Math.ceil(
                        (new Date(currentProgram.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </span>
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
