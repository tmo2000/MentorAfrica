"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, X, Clock, Eye, User, Calendar, MessageSquare } from "lucide-react"

// Mock applications data
const mockApplications = {
  mentor: [
    {
      id: "1",
      menteeId: "2",
      menteeName: "Alex Chen",
      menteeEmail: "alex@example.com",
      status: "pending",
      appliedAt: "2024-01-15",
      motivation:
        "I'm really interested in working with you because of your extensive experience in software engineering and leadership. I'm currently a junior developer looking to advance my career and develop stronger technical and leadership skills.",
      goals:
        "I want to become a senior engineer within the next 2 years and eventually move into technical leadership roles. I'm particularly interested in learning about system design, team management, and career progression strategies.",
      experience:
        "I have 8 months of experience as a junior developer at a startup. I work primarily with React and Node.js, and I've been involved in building several key features for our product.",
      commitment:
        "I'm fully committed to this mentorship and can dedicate 2-3 hours per week to meetings, assignments, and self-study. I'm eager to learn and will come prepared to every session.",
      preferredDuration: "6",
      availability: "Weekday evenings after 6 PM PST",
      questions: "What does a typical mentorship session look like? How do you prefer to track progress and set goals?",
    },
    {
      id: "2",
      menteeId: "3",
      menteeName: "Jordan Smith",
      menteeEmail: "jordan@example.com",
      status: "pending",
      appliedAt: "2024-01-14",
      motivation:
        "Your background in product management really resonates with my career goals. I'm looking to transition from engineering to product management and would love to learn from your experience.",
      goals:
        "I want to transition from my current engineering role to product management within the next year. I'm interested in learning about product strategy, stakeholder management, and user research.",
      experience:
        "I'm a software engineer with 3 years of experience. I've been increasingly involved in product decisions and user research at my current company.",
      commitment:
        "I can commit 3-4 hours per week and am willing to take on additional projects or reading assignments to accelerate my learning.",
      preferredDuration: "6",
      availability: "Flexible, can accommodate most times",
      questions: "What skills should I focus on developing to make a successful transition to product management?",
    },
  ],
  mentee: [
    {
      id: "3",
      mentorId: "1",
      mentorName: "Sarah Johnson",
      status: "accepted",
      appliedAt: "2024-01-10",
      respondedAt: "2024-01-12",
      programStart: "2024-02-01",
      duration: "6",
    },
    {
      id: "4",
      mentorId: "2",
      mentorName: "Michael Chen",
      status: "pending",
      appliedAt: "2024-01-13",
    },
  ],
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handleApplicationAction = (applicationId: string, action: "accept" | "reject") => {
    console.log("[v0] Application action:", { applicationId, action })
    // In real app, this would update the database
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderMentorApplications = () => {
    const applications = mockApplications.mentor

    return (
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet</p>
              <p className="text-sm text-gray-500 mt-2">Applications from mentees will appear here</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {application.menteeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{application.menteeName}</h3>
                      <p className="text-gray-600 text-sm">{application.menteeEmail}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{application.preferredDuration} months</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mt-3 line-clamp-2">{application.motivation}</p>
                    </div>
                  </div>

                  <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Application from {application.menteeName}</DialogTitle>
                        <DialogDescription>
                          Applied on {new Date(application.appliedAt).toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Why they want to work with you:</h4>
                          <p className="text-gray-700 leading-relaxed">{application.motivation}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Their goals:</h4>
                          <p className="text-gray-700 leading-relaxed">{application.goals}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Experience:</h4>
                          <p className="text-gray-700 leading-relaxed">{application.experience}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Commitment:</h4>
                          <p className="text-gray-700 leading-relaxed">{application.commitment}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Preferred Duration:</h4>
                            <p className="text-gray-700">{application.preferredDuration} months</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Availability:</h4>
                            <p className="text-gray-700">{application.availability}</p>
                          </div>
                        </div>

                        {application.questions && (
                          <div>
                            <h4 className="font-semibold mb-2">Questions for you:</h4>
                            <p className="text-gray-700 leading-relaxed">{application.questions}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {application.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApplicationAction(application.id, "accept")}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplicationAction(application.id, "reject")}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  const renderMenteeApplications = () => {
    const applications = mockApplications.mentee

    return (
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet</p>
              <p className="text-sm text-gray-500 mt-2">Your mentor applications will appear here</p>
              <Button onClick={() => router.push("/mentors")} className="mt-4">
                Browse Mentors
              </Button>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {application.mentorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{application.mentorName}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        {application.respondedAt && (
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Responded {new Date(application.respondedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {application.status === "accepted" && application.programStart && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-green-800 font-medium">
                            Program starts {new Date(application.programStart).toLocaleDateString()}
                          </p>
                          <p className="text-green-700 text-sm">Duration: {application.duration} months</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Applications</h1>
            <p className="text-xl text-gray-600">
              {user.role === "mentor" ? "Review applications from mentees" : "Track your mentor applications"}
            </p>
          </div>

          {user.role === "mentor" ? (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="all">All Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">{renderMentorApplications()}</TabsContent>

              <TabsContent value="accepted">
                <div className="text-center py-8">
                  <p className="text-gray-500">Accepted applications will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="all">{renderMentorApplications()}</TabsContent>
            </Tabs>
          ) : (
            renderMenteeApplications()
          )}
        </div>
      </div>
    </div>
  )
}
