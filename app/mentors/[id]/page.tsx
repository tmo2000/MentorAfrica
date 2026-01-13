"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import type { Mentor } from "@/lib/mock-mentors"
import { useAuth } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eoiService, mentorshipService } from "@/lib/matchingService"
import { MapPin, Clock, Star, ArrowLeft, CheckCircle, Info, AlertTriangle } from "lucide-react"

export default function MentorDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const mentorId = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined)
  const { user } = useAuth()

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [myEOIs, setMyEOIs] = useState(() => (user ? eoiService.listMyEOIs(user.id) : []))
  const [goal, setGoal] = useState("")
  const [note, setNote] = useState("")
  const [rank, setRank] = useState<"1" | "2" | "3">("1")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mentorId) return

    ;(async () => {
      setLoading(true)
      const { data: byId, error: byIdError } = await supabase.from("mentors").select("*").eq("id", mentorId).maybeSingle()

      const { data: byUserId, error: byUserError } =
        byId ? { data: null, error: null } : await supabase.from("mentors").select("*").eq("user_id", mentorId).maybeSingle()

      const data = byId ?? byUserId
      const error = data ? null : byUserError ?? byIdError

      if (error || !data) {
        console.error("Supabase mentor fetch error:", error)
        setMentor(null)
        setLoading(false)
        return
      }

      const mapped: Mentor = {
        id: String(data.user_id ?? data.id),
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
      setLoading(false)
    })()
  }, [mentorId])

  useEffect(() => {
    if (user) {
      setMyEOIs(eoiService.listMyEOIs(user.id))
    }
  }, [user])

  const activeMentorship = useMemo(() => (user ? mentorshipService.hasActiveMentorship(user.id) : false), [user])

  const activeEOIsCount = useMemo(
    () => myEOIs.filter((e) => e.status === "EOI" || e.status === "INVITED").length,
    [myEOIs]
  )

  const alreadyInterested = useMemo(
    () => myEOIs.some((e) => e.mentorId === mentorId && (e.status === "EOI" || e.status === "INVITED")),
    [myEOIs, mentorId]
  )

  if (loading) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-gray-700">Mentor not found.</p>
              <Button onClick={() => router.push("/mentors")} className="flex items-center gap-2 justify-center">
                <ArrowLeft className="h-4 w-4" />
                Back to mentors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Button variant="ghost" onClick={() => router.push("/mentors")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to mentors
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                    {mentor.available && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Available
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mentor.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mentor.timezone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {mentor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push("/mentors")}>
                  Browse mentors
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <CardTitle>About</CardTitle>
                <CardDescription className="text-gray-700 leading-relaxed">{mentor.bio || "No bio provided yet."}</CardDescription>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.length === 0 ? (
                    <span className="text-sm text-gray-500">No expertise listed.</span>
                  ) : (
                    mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Program duration</p>
                    <p className="text-xl font-semibold text-gray-900">{mentor.programDuration || "N/A"} months</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Mentee capacity</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {mentor.currentMentees}/{mentor.maxMentees || 0} mentees
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500">Past mentees</p>
                    <p className="text-xl font-semibold text-gray-900">{mentor.totalMentees}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Express interest
                  </CardTitle>
                  <CardDescription>
                    Share a short goal and rank this mentor. You can hold up to three active interests at a time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!mentor.available || mentor.currentMentees >= mentor.maxMentees ? (
                    <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-3">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="font-medium">Not currently accepting</p>
                        <p>This mentor is at capacity right now.</p>
                      </div>
                    </div>
                  ) : null}

                  {activeMentorship ? (
                    <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-3">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="font-medium">You can only have one active mentorship at a time.</p>
                        <p>Wrap up your current mentorship before expressing new interest.</p>
                      </div>
                    </div>
                  ) : null}

                  {feedback ? <p className="text-sm text-green-700">{feedback}</p> : null}
                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

                  <div className="space-y-2">
                    <Label htmlFor="goal">Your goal (max 280)</Label>
                    <Textarea
                      id="goal"
                      maxLength={280}
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Share a short goal for this mentorship..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Optional note (max 280)</Label>
                    <Textarea
                      id="note"
                      maxLength={280}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Anything else the mentor should know..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rank">Rank</Label>
                      <Select value={rank} onValueChange={(val) => setRank(val as "1" | "2" | "3")}>
                        <SelectTrigger id="rank">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (top choice)</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Active interests</Label>
                      <Input readOnly value={`${activeEOIsCount} of 3 used`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        if (!user || user.role !== "mentee") {
                          router.push("/auth/login?role=mentee")
                          return
                        }
                        setFeedback(null)
                        setError(null)
                        if (mentor.currentMentees >= mentor.maxMentees || !mentor.available) {
                          setError("This mentor is not currently accepting.")
                          return
                        }
                        if (activeMentorship) {
                          setError("You can only have one active mentorship at a time.")
                          return
                        }
                        if (!goal.trim()) {
                          setError("Please add a brief goal.")
                          return
                        }
                        setSubmitting(true)
                        const result = eoiService.createEOI({
                          mentorId,
                          menteeId: user.id,
                          menteeGoal: goal.trim(),
                          note: note.trim(),
                          rankedPreference: rank === "1" ? 1 : rank === "2" ? 2 : 3,
                        })
                        if (!result.ok) {
                          setError(result.error || "Unable to submit interest.")
                        } else {
                          setGoal("")
                          setNote("")
                          setFeedback("Interest sent. The mentor may invite you to apply.")
                          setMyEOIs(eoiService.listMyEOIs(user.id))
                        }
                        setSubmitting(false)
                      }}
                      disabled={
                        submitting ||
                        !goal.trim() ||
                        alreadyInterested ||
                        activeEOIsCount >= 3 ||
                        activeMentorship ||
                        !mentor.available ||
                        mentor.currentMentees >= mentor.maxMentees
                      }
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      {alreadyInterested ? "Interest sent" : submitting ? "Submitting..." : "Express interest"}
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/mentee/dashboard">View my interests</Link>
                    </Button>
                  </div>
                  {alreadyInterested ? (
                    <p className="text-xs text-gray-600">You already expressed interest in this mentor.</p>
                  ) : null}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
