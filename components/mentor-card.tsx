"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star } from "lucide-react"
import type { Mentor } from "@/lib/mock-mentors"

type MentorCardProps = {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
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
        <div className="mt-4 flex gap-2">
          <Link href={`/mentors/${mentor.id}`}>
            <Button variant="outline" className="border-2 bg-white cursor-pointer">
              Learn more
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  )
}
