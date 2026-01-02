"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { Mentor } from "@/lib/mock-mentors"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, User, Calendar, Star, MapPin, Clock } from "lucide-react"

export default function ApplyPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const params = useParams()
  const mentorId = params.mentorId as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [mentorLoading, setMentorLoading] = useState(true)

  const [applicationData, setApplicationData] = useState({
    motivation: "",
    goals: "",
    experience: "",
    commitment: "",
    preferredDuration: "6",
    availability: "",
    questions: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [savedDraft, setSavedDraft] = useState(false)

  // Redirect checks (same logic as you had)
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    if (user.role !== "mentee") {
      router.push("/mentor/dashboard")
      return
    }
  }, [user, router])

  // Fetch mentor from Supabase (replaces mockMentors.find)
  useEffect(() => {
    if (!mentorId) return

    ;(async () => {
      setMentorLoading(true)

      const { data, error } = await supabase
        .from("mentors")
        .select("*")
        .eq("id", mentorId)
        .single()

      if (error) {
        console.error("Supabase mentor fetch error:", error)
        setMentor(null)
        setMentorLoading(false)
        return
      }

      const mapped: Mentor = {
        id: data.id,
        name: data.name,
        bio: data.bio ?? "",
        location: data.location ?? "",
        timezone: data.timezone ?? "",
        expertise: Array.isArray(data.expertise) ? data.expertise : [],
        maxMentees: data.max_mentees ?? 0,
        currentMentees: data.current_mentees ?? 0,
        programDuration: String(data.program_duration_months ?? ""),
        rating: Number(data.rating ?? 0),
        totalMentees: data.total_mentees ?? 0,
        avatar: data.avatar || null,
        available: Boolean(data.available),
      }

      setMentor(mapped)
      setMentorLoading(false)
    })()
  }, [mentorId])

  // While redirecting or loading mentor, don’t render the form yet
  if (!user || user.role !== "mentee") return null

  if (mentorLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Loading mentor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Mentor not found</p>
            <Button onClick={() => router.push("/mentors")} className="mt-4">
              Back to Mentors
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock submission (keep as-is for now)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Application submitted:", {
      mentorId,
      menteeId: user.id,
      ...applicationData,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)

    updateUser({
      appliedMentorId: mentorId,
      appliedMentorName: mentor.name,
      applicationStatus: "submitted",
      applicationNote: applicationData.motivation,
    })
  }

  const handleSaveDraft = () => {
    updateUser({
      appliedMentorId: mentorId,
      appliedMentorName: mentor.name,
      applicationStatus: "draft",
      applicationNote: applicationData.motivation || "Draft application in progress",
    })
    setSavedDraft(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-2xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-600">
              Your application to <strong>{mentor.name}</strong> has been submitted successfully. You&apos;ll receive a
              notification once they review your application.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/mentee/dashboard")}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => router.push("/mentors")}>
                Browse More Mentors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" onClick={() => router.push("/mentors")} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Mentors
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mentor Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-center">Applying to</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{mentor.timezone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{mentor.programDuration} month programs</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 leading-relaxed">{mentor.bio}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mentorship Application
                  </CardTitle>
                  <CardDescription>Tell us about yourself and why you'd like to work with this mentor</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="motivation">Why do you want to work with this mentor? *</Label>
                      <Textarea
                        id="motivation"
                        required
                        placeholder="Explain what draws you to this mentor and how their expertise aligns with your goals..."
                        value={applicationData.motivation}
                        onChange={(e) => setApplicationData({ ...applicationData, motivation: e.target.value })}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="goals">What are your specific goals for this mentorship? *</Label>
                      <Textarea
                        id="goals"
                        required
                        placeholder="Describe what you hope to achieve during the mentorship program..."
                        value={applicationData.goals}
                        onChange={(e) => setApplicationData({ ...applicationData, goals: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Tell us about your relevant experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Share your background, current role, and relevant experience..."
                        value={applicationData.experience}
                        onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredDuration">Preferred Program Duration</Label>
                        <Select
                          value={applicationData.preferredDuration}
                          onValueChange={(value) => setApplicationData({ ...applicationData, preferredDuration: value })}
                        >
                          <SelectTrigger>
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
                        <Label htmlFor="availability">Your Availability</Label>
                        <Input
                          id="availability"
                          placeholder="e.g., Weekday evenings, Weekend mornings"
                          value={applicationData.availability}
                          onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="commitment">How will you commit to this mentorship? *</Label>
                      <Textarea
                        id="commitment"
                        required
                        placeholder="Describe how you plan to make the most of this mentorship opportunity..."
                        value={applicationData.commitment}
                        onChange={(e) => setApplicationData({ ...applicationData, commitment: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="questions">Questions for your potential mentor</Label>
                      <Textarea
                        id="questions"
                        placeholder="Any specific questions you'd like to ask this mentor..."
                        value={applicationData.questions}
                        onChange={(e) => setApplicationData({ ...applicationData, questions: e.target.value })}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 flex-wrap">
                      <Button type="button" variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                        Save draft
                      </Button>

                      <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>

                      <Button type="button" variant="outline" onClick={() => router.push("/mentors")}>
                        Cancel
                      </Button>

                      {savedDraft && <span className="text-xs text-green-700">Draft saved</span>}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
