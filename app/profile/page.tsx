"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { Edit, Save, X, MapPin, Clock, Users, Target, Award, Star, BookOpen } from "lucide-react"

type ProfileRow = {
  id: string
  full_name: string | null
  role: "mentor" | "mentee" | "admin"
  avatar_url: string | null
  bio: string | null
  location: string | null
  timezone: string | null
}

type MentorRow = {
  id: string
  user_id: string
  expertise: string[] | null
  max_mentees: number | null
  program_duration_months: number | null
  experience: string | null
  rating: number | null
  total_mentees: number | null
  completed_programs: number | null
  available: boolean | null
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [mentor, setMentor] = useState<MentorRow | null>(null)

  // Guards
  useEffect(() => {
    if (!user) router.push("/auth/login")
  }, [user, router])

  // Load profile + mentor details (if mentor)
  useEffect(() => {
    ;(async () => {
      if (!user?.id) return

      setLoading(true)
      setError(null)

      // 1) profile row
      const { data: p, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url, bio, location, timezone")
        .eq("id", user.id)
        .single()

      if (pErr) {
        setError(pErr.message)
        setLoading(false)
        return
      }

      setProfile(p as ProfileRow)

      // 2) mentor row (only if mentor)
      if ((p as ProfileRow).role === "mentor") {
        const { data: m, error: mErr } = await supabase
          .from("mentors")
          .select(
            "id, user_id, expertise, max_mentees, program_duration_months, experience, rating, total_mentees, completed_programs, available"
          )
          .eq("user_id", user.id)
          .single()

        if (mErr) {
          // not fatal; mentor might not have row yet
          setMentor(null)
        } else {
          setMentor(m as MentorRow)
        }
      } else {
        setMentor(null)
      }

      setLoading(false)
    })()
  }, [user?.id])

  const initials = useMemo(() => {
    const name = profile?.full_name || user?.email || "U"
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("")
  }, [profile?.full_name, user?.email])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)

    // update profiles
    const { error: pErr } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
        timezone: profile.timezone,
      })
      .eq("id", profile.id)

    if (pErr) {
      setError(pErr.message)
      setSaving(false)
      return
    }

    // update mentors (only if mentor row exists)
    if (profile.role === "mentor" && mentor) {
      const { error: mErr } = await supabase
        .from("mentors")
        .update({
          expertise: mentor.expertise,
          max_mentees: mentor.max_mentees,
          program_duration_months: mentor.program_duration_months,
          experience: mentor.experience,
        })
        .eq("id", mentor.id)

      if (mErr) {
        setError(mErr.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // easiest: just reload from DB
    window.location.reload()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {profile?.role === "mentor" && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mentor?.rating ?? 0}</span>
                      <span className="text-gray-500 text-sm">({mentor?.total_mentees ?? 0} mentees)</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profile?.full_name || user.email}
                      </h1>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {profile?.role || "user"}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className="flex items-center gap-2"
                      disabled={loading}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profile?.location || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{profile?.timezone || "—"}</span>
                    </div>
                    {profile?.role === "mentor" && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{mentor?.max_mentees ?? 0} max mentees</span>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {loading && <p className="text-sm text-gray-500">Loading profile…</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mentor stats */}
          {profile?.role === "mentor" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{mentor?.total_mentees ?? 0}</p>
                      <p className="text-sm text-gray-600">Total Mentees</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{mentor?.completed_programs ?? 0}</p>
                      <p className="text-sm text-gray-600">Completed Programs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{mentor?.rating ?? 0}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile details */}
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              {profile?.role === "mentor" ? (
                <>
                  <TabsTrigger value="expertise">Expertise</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="interests">Interests</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label>Full name</Label>
                        <Input
                          value={profile?.full_name ?? ""}
                          onChange={(e) => setProfile((p) => (p ? { ...p, full_name: e.target.value } : p))}
                        />
                      </div>

                      <div>
                        <Label>Bio</Label>
                        <Textarea
                          value={profile?.bio ?? ""}
                          onChange={(e) => setProfile((p) => (p ? { ...p, bio: e.target.value } : p))}
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={profile?.location ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, location: e.target.value } : p))}
                          />
                        </div>
                        <div>
                          <Label>Timezone</Label>
                          <Input
                            value={profile?.timezone ?? ""}
                            onChange={(e) => setProfile((p) => (p ? { ...p, timezone: e.target.value } : p))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{profile?.bio || "—"}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mentor tabs */}
            {profile?.role === "mentor" && (
              <>
                <TabsContent value="expertise">
                  <Card>
                    <CardHeader>
                      <CardTitle>Expertise</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <div>
                          <Label>Expertise (comma-separated)</Label>
                          <Input
                            value={(mentor?.expertise ?? []).join(", ")}
                            onChange={(e) =>
                              setMentor((m) =>
                                m
                                  ? {
                                      ...m,
                                      expertise: e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                    }
                                  : m
                              )
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(mentor?.expertise ?? []).map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Max mentees</Label>
                          <Input
                            type="number"
                            disabled={!isEditing}
                            value={mentor?.max_mentees ?? 0}
                            onChange={(e) =>
                              setMentor((m) => (m ? { ...m, max_mentees: Number(e.target.value) } : m))
                            }
                          />
                        </div>
                        <div>
                          <Label>Program duration (months)</Label>
                          <Input
                            type="number"
                            disabled={!isEditing}
                            value={mentor?.program_duration_months ?? 6}
                            onChange={(e) =>
                              setMentor((m) =>
                                m ? { ...m, program_duration_months: Number(e.target.value) } : m
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience">
                  <Card>
                    <CardHeader>
                      <CardTitle>Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <Label>Experience</Label>
                          <Textarea
                            value={mentor?.experience ?? ""}
                            onChange={(e) => setMentor((m) => (m ? { ...m, experience: e.target.value } : m))}
                            className="min-h-[140px]"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{mentor?.experience || "—"}</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}

            {/* Mentee tabs (placeholder for later; you can add columns in profiles) */}
            {profile?.role === "mentee" && (
              <>
                <TabsContent value="goals">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" /> Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Next: add a `goals` column to `profiles` and render it here (we’ll do it after profile save works).
                      </p>
                      <Button asChild className="mt-3">
                        <Link href="/apply">Apply for mentorship</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="interests">
                  <Card>
                    <CardHeader>
                      <CardTitle>Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Next: add an `interests text[]` column to `profiles` and render it here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
