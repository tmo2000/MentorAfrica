"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, User, Target, Calendar } from "lucide-react"

export default function CentralApplyPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const [applicationData, setApplicationData] = useState({
    motivation: "",
    goals: "",
    experience: "",
    focusAreas: "",
    preferredDuration: "6",
    availability: "",
    questions: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "mentee") {
    router.push("/mentor/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Centralized application submitted:", {
      menteeId: user.id,
      ...applicationData,
    })

    updateUser({
      appliedMentorId: null,
      appliedMentorName: "Mentor pool",
      applicationStatus: "submitted",
      applicationNote: applicationData.motivation,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Application submitted</h1>
                <p className="text-gray-600">
                  Thanks for applying! We&apos;ll review your details and match you with an available mentor. Expect an
                  update soon.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push("/mentee/dashboard")}>Go to dashboard</Button>
                  <Button variant="outline" onClick={() => router.push("/mentors")}>
                    Browse mentors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Apply for mentorship</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Submit one application and we&apos;ll pair you with the best available mentor based on your goals and
              availability.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tell us about you
              </CardTitle>
              <CardDescription>Share your goals and availability so we can make the right match.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motivation">Why do you want a mentor? *</Label>
                    <Textarea
                      id="motivation"
                      required
                      placeholder="Explain what you hope to gain from mentorship..."
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({ ...applicationData, motivation: e.target.value })}
                      className="min-h-[110px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals">Top goals *</Label>
                    <Textarea
                      id="goals"
                      required
                      placeholder="List the outcomes you want to achieve..."
                      value={applicationData.goals}
                      onChange={(e) => setApplicationData({ ...applicationData, goals: e.target.value })}
                      className="min-h-[110px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Your experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Role, years of experience, recent projects..."
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="focusAreas">Focus areas</Label>
                    <Input
                      id="focusAreas"
                      placeholder="e.g., System design, PM transition, Leadership"
                      value={applicationData.focusAreas}
                      onChange={(e) => setApplicationData({ ...applicationData, focusAreas: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDuration">Preferred program duration</Label>
                    <Select
                      value={applicationData.preferredDuration}
                      onValueChange={(value) => setApplicationData({ ...applicationData, preferredDuration: value })}
                    >
                      <SelectTrigger id="preferredDuration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      placeholder="e.g., Weekday evenings, Weekend mornings"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="questions">Any questions or preferences?</Label>
                  <Textarea
                    id="questions"
                    placeholder="Share scheduling constraints, mentor preferences, or questions..."
                    value={applicationData.questions}
                    onChange={(e) => setApplicationData({ ...applicationData, questions: e.target.value })}
                    className="min-h-[90px]"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit application
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/mentors")}
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    View mentors
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      updateUser({
                        appliedMentorId: null,
                        appliedMentorName: "Mentor pool",
                        applicationStatus: "draft",
                        applicationNote:
                          applicationData.motivation || "Draft application in progress",
                      })
                    }}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Save and continue later
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
