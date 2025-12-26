"use client"

import { useEffect, useState } from "react"
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
import { Calendar, Clock, Plus, Target } from "lucide-react"

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

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?role=mentee")
    } else if (user.role !== "mentee") {
      router.push("/")
    }
  }, [router, user])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-600">Log meetings, track goals, and stay ready for your next session.</p>
        </div>

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
                  <Plus className="h-4 w-4 mr-2" />
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
                <Target className="h-5 w-5" />
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
