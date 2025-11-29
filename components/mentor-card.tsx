"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, MapPin, Star, Users } from "lucide-react"
import type { Mentor } from "@/lib/mock-mentors"

type MentorCardProps = {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleApply = () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    router.push(`/apply/${mentor.id}`)
  }

  return (
    <Dialog>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{mentor.name}</CardTitle>
          <CardDescription className="text-gray-600">{mentor.bio}</CardDescription>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {mentor.expertise.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {mentor.location}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {mentor.timezone}
            </span>
          </div>
          <div className="mt-4">
            <DialogTrigger asChild>
              <Button variant="outline" className="border-2 bg-white">
                Read more
              </Button>
            </DialogTrigger>
          </div>
        </CardHeader>
      </Card>

      <DialogContent className="w-[calc(100vw-2rem)] max-w-screen-xl">
        <DialogHeader className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                  {mentor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{mentor.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-3 mt-1 text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {mentor.timezone}
                  </span>
                </DialogDescription>
              </div>
            </div>
            {mentor.available ? (
              <Button
                onClick={handleApply}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Apply for this mentor
              </Button>
            ) : (
              <Badge variant="secondary">Not accepting mentees</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {mentor.expertise.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="rounded-xl bg-blue-50 p-3">
              <div className="flex items-center gap-2 text-blue-800 font-semibold">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {mentor.rating} rating
              </div>
              <p className="text-gray-500 mt-1">{mentor.totalMentees} total mentees</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <div className="flex items-center gap-2 text-indigo-800 font-semibold">
                <Users className="h-4 w-4" />
                {mentor.currentMentees}/{mentor.maxMentees} mentees
              </div>
              <p className="text-gray-500 mt-1">{mentor.programDuration}-month programs</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                {mentor.available ? "Accepting mentees" : "Currently full"}
              </div>
              <p className="text-gray-500 mt-1">Availability updates weekly</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-sm text-blue-800 font-semibold mb-1">About</p>
              <p className="leading-relaxed">{mentor.bio}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-2">
              <p className="text-sm text-indigo-800 font-semibold">Program fit</p>
              <p className="text-sm text-gray-700">Track length: {mentor.programDuration} months</p>
              <p className="text-sm text-gray-700">Timezone: {mentor.timezone}</p>
              <p className="text-sm text-gray-700">Location: {mentor.location}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
