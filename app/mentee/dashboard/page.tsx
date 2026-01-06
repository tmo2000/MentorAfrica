"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  applicationService,
  eoiService,
  inviteService,
  mentorshipService,
  type Application,
  type ExpressionOfInterest,
  type Invite,
} from "@/lib/matchingService"
import {
  Calendar,
  Check,
  Clock,
  MessageCircle,
  Target,
  Inbox,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

type Meeting = {
  id: string
  title: string
  date: string
  link?: string
  notes?: string
}

type Goal = {
  id: string
  text: string
  done: boolean
}

export default function MenteeDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Kickoff with mentor",
      date: "2024-02-20T14:00",
      link: "https://meet.example.com/abc",
      notes: "Discuss expectations and goals.",
    },
  ])
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", text: "Draft system design case study", done: false },
    { id: "2", text: "Share weekly update before Friday", done: true },
  ])
  const [newMeeting, setNewMeeting] = useState({ title: "", date: "", link: "", notes: "" })

  const [eois, setEois] = useState<ExpressionOfInterest[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [hasActiveMentorship, setHasActiveMentorship] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?role=mentee")
    } else if (user.role !== "mentee") {
      router.push("/")
    } else {
      setEois(eoiService.listMyEOIs(user.id))
      setInvites(inviteService.listMyInvites(user.id))
      setApplications(applicationService.listMyApplications(user.id))
      setHasActiveMentorship(mentorshipService.hasActiveMentorship(user.id))
    }
  }, [router, user])

  const hasAcceptedInvite = useMemo(() => invites.some((i) => i.status === "ACCEPTED"), [invites])

  if (!user || user.role !== "mentee") {
    return null
  }

  const addMeeting = () => {
    if (!newMeeting.title.trim()) return
    setMeetings((prev) => [
      {
        id: Date.now().toString(),
        title: newMeeting.title.trim(),
        date: newMeeting.date,
        link: newMeeting.link.trim() || undefined,
        notes: newMeeting.notes.trim() || undefined,
      },
      ...prev,
    ])
    setNewMeeting({ title: "", date: "", link: "", notes: "" })
  }

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  const withdrawEOI = (id: string) => {
    if (!user) return
    eoiService.withdrawEOI(id, user.id)
    setEois(eoiService.listMyEOIs(user.id))
    setInvites(inviteService.listMyInvites(user.id))
  }

  const acceptInvite = (id: string) => {
    if (!user) return
    inviteService.acceptInvite(id, user.id)
    setInvites(inviteService.listMyInvites(user.id))
    setEois(eoiService.listMyEOIs(user.id))
  }

  const declineInvite = (id: string) => {
    if (!user) return
    inviteService.declineInvite(id, user.id)
    setInvites(inviteService.listMyInvites(user.id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-600">Track interests, invites, and applications.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/mentors">Browse mentors</Link>
          </Button>
        </div>

        {hasActiveMentorship && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-4 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-green-700" />
              <div>
                <p className="font-semibold text-green-800">Active mentorship</p>
                <p className="text-sm text-green-700">
                  You have an active mentorship. New expressions of interest are disabled until it ends.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {eois.length === 0 ? (
                <p className="text-sm text-gray-600">No interests yet. Visit a mentor profile to express interest.</p>
              ) : (
                eois.map((eoi) => (
                  <div key={eoi.id} className="p-3 border rounded-lg bg-white flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Rank {eoi.rankedPreference}</Badge>
                        <Badge>{eoi.status}</Badge>
                      </div>
                      {eoi.status === "EOI" ? (
                        <Button variant="ghost" size="sm" onClick={() => withdrawEOI(eoi.id)}>
                          Withdraw
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-3">{eoi.menteeGoal}</p>
                    {eoi.note ? <p className="text-xs text-gray-600">Note: {eoi.note}</p> : null}
                    <p className="text-xs text-gray-500">
                      Sent {new Date(eoi.createdAt).toLocaleDateString()} to mentor {eoi.mentorId}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                My invites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invites.length === 0 ? (
                <p className="text-sm text-gray-600">No invites yet. Mentors will invite you after reviewing your interests.</p>
              ) : (
                invites.slice(0, 5).map((invite) => (
                  <div key={invite.id} className="p-3 border rounded-lg bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{invite.status}</Badge>
                        <span className="text-sm text-gray-700">Mentor {invite.mentorId}</span>
                      </div>
                      {invite.status === "PENDING" && !hasAcceptedInvite ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => acceptInvite(invite.id)}>
                            Accept invite
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => declineInvite(invite.id)}>
                            Decline
                          </Button>
                        </div>
                      ) : invite.status === "ACCEPTED" ? (
                        <Button size="sm" onClick={() => router.push("/apply")}>
                          Complete application
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-500">Locked</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Received {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
              {hasAcceptedInvite ? (
                <p className="text-xs text-gray-600">
                  You accepted an invite. Other invites are locked until you submit your application.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              My applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-sm text-gray-600">No applications submitted yet.</p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-3 border rounded-lg bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">Mentor {app.mentorId}</p>
                    <p className="text-xs text-gray-500">
                      Submitted {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{app.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Title</Label>
                  <Input
                    id="meeting-title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., Mock interview prep"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-date">Date & time</Label>
                  <Input
                    id="meeting-date"
                    type="datetime-local"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-link">Teams/Meet link (optional)</Label>
                  <Input
                    id="meeting-link"
                    value={newMeeting.link}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, link: e.target.value }))}
                    placeholder="https://teams.microsoft.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-notes">Notes</Label>
                  <Textarea
                    id="meeting-notes"
                    value={newMeeting.notes}
                    onChange={(e) => setNewMeeting((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Agenda, prep items, next steps"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={addMeeting} disabled={!newMeeting.title.trim()}>
                  Log meeting
                </Button>
              </div>

              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="border border-gray-100">
                    <CardContent className="pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleString()}
                        </div>
                        <p className="text-base font-semibold text-gray-900">{meeting.title}</p>
                        {meeting.notes && <p className="text-sm text-gray-600 mt-1">{meeting.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.link ? (
                          <Button asChild variant="outline" size="sm">
                            <Link href={meeting.link} target="_blank" rel="noreferrer">
                              Join call
                            </Link>
                          </Button>
                        ) : (
                          <Badge variant="secondary">Add call link</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    checked={goal.done}
                    onChange={() => toggleGoal(goal.id)}
                  />
                  <div>
                    <p className={`text-sm ${goal.done ? "text-gray-500 line-through" : "text-gray-800"}`}>{goal.text}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500">
                Coming soon: auto-sync with mentor updates and embedded Teams/Meet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
