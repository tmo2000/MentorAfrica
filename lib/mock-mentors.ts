export type Mentor = {
  id: string
  name: string
  bio: string
  location: string
  timezone: string
  expertise: string[]
  maxMentees: number
  currentMentees: number
  programDuration: string
  rating: number
  totalMentees: number
  avatar: string | null
  available: boolean
}

