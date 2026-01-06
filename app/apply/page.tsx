"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { inviteService, applicationService, mentorshipService } from "@/lib/matchingService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, User, Target, Calendar, AlertTriangle } from "lucide-react"

export default function CentralApplyPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()

  const [mentorName, setMentorName] = useState<string>("Selected mentor")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [applicationData, setApplicationData] = useState({
    motivation: "",
    goals: "",
    experience: "",
    focusAreas: "",
    preferredDuration: "6",
    availability: "",
    questions: "",
  })

  const invites = useMemo(() => (user ? inviteService.listMyInvites(user.id) : []), [user])
  const acceptedInvite = useMemo(() => invites.find((i) => i.status === "ACCEPTED"), [invites])
  const activeMentorship = useMemo(() => (user ? mentorshipService.hasActiveMentorship(user.id) : false), [user])

  useEffect(() => {
    const fetchMentor = async () => {
      if (acceptedInvite?.mentorId) {
        const { data } = await supabase.from("mentors").select("name").eq("id", acceptedInvite.mentorId).maybeSingle()
        if (data?.name) setMentorName(data.name)
      }
    }
    fetchMentor()
  }, [acceptedInvite])

  // Guards
  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "mentee") {
    router.push("/mentor/dashboard")
    return null
  }

  if (activeMentorship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="pt-8 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">You already have an active mentorship.</span>
                </div>
                <p className="text-gray-600">Finish your current mentorship before submitting a new application.</p>
                <Button variant="outline" onClick={() => router.push("/mentee/dashboard")} className="mt-2">
                  Go to dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!acceptedInvite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="pt-8 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">You need an accepted invite to apply.</span>
                </div>
                <p className="text-gray-600">
                  Accept an invite from your preferred mentor, then come back to submit your full application.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => router.push("/mentee/dashboard")}>
                  View my invites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = applicationService.submitApplication({
      inviteId: acceptedInvite.id,
      mentorId: acceptedInvite.mentorId,
      menteeId: user.id,
      payload: applicationData,
    })

    if (!result.ok) {
      setError(result.error || "Unable to submit application.")
      setIsSubmitting(false)
      return
    }

    updateUser({
      appliedMentorId: acceptedInvite.mentorId,
      appliedMentorName: mentorName,
      applicationStatus: "submitted",
      applicationNote: applicationData.motivation,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  /* =======================
     SUCCESS STATE
  ======================= */
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
                  We&apos;ve received your application for {mentorName}. Your mentor will review it soon.
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

  /* =======================
     FORM
  ======================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Application for {mentorName}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You accepted an invite from {mentorName}. Complete the full application to proceed.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tell us about you
              </CardTitle>
              <CardDescription>Your goals and availability help the mentor review your fit.</CardDescription>
            </CardHeader>

            <CardContent>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Why do you want a mentor? *</Label>
                    <Textarea
                      required
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({ ...applicationData, motivation: e.target.value })}
                      className="min-h-[110px]"
                    />
                  </div>

                  <div>
                    <Label>Top goals *</Label>
                    <Textarea
                      required
                      value={applicationData.goals}
                      onChange={(e) => setApplicationData({ ...applicationData, goals: e.target.value })}
                      className="min-h-[110px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Your experience</Label>
                    <Textarea
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Focus areas</Label>
                    <Input
                      value={applicationData.focusAreas}
                      onChange={(e) => setApplicationData({ ...applicationData, focusAreas: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred duration</Label>
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
                    <Label>Availability</Label>
                    <Input
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Questions or preferences</Label>
                  <Textarea
                    value={applicationData.questions}
                    onChange={(e) => setApplicationData({ ...applicationData, questions: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit application"}
                  </Button>

                  <Button variant="outline" onClick={() => router.push("/mentors")}>
                    <Target className="h-4 w-4 mr-2" />
                    View mentors
                  </Button>

                  <Button variant="outline" onClick={() => router.push("/mentee/dashboard")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Save for later
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
