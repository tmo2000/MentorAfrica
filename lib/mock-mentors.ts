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

export const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    bio: "Experienced software engineer with 10+ years in tech leadership. Passionate about helping others grow their careers.",
    location: "San Francisco, CA",
    timezone: "PST",
    expertise: ["Software Engineering", "Leadership", "Product Management"],
    maxMentees: 3,
    currentMentees: 2,
    programDuration: "6",
    rating: 4.9,
    totalMentees: 15,
    avatar: "/mentor1.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    bio: "Senior Product Manager at a Fortune 500 company. Specializing in product strategy and team management.",
    location: "New York, NY",
    timezone: "EST",
    expertise: ["Product Management", "Strategy", "Analytics"],
    maxMentees: 2,
    currentMentees: 1,
    programDuration: "3",
    rating: 4.8,
    totalMentees: 8,
    avatar: "/mentor2.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    bio: "UX Design Director with expertise in design systems and user research. Mentor to aspiring designers.",
    location: "Austin, TX",
    timezone: "CST",
    expertise: ["Design", "UX Research", "Design Systems"],
    maxMentees: 4,
    currentMentees: 4,
    programDuration: "6",
    rating: 4.9,
    totalMentees: 22,
    avatar: "/mentor3.jpg",
    available: false,
  },
  {
    id: "4",
    name: "David Kim",
    bio: "Data Science Lead with experience in machine learning and analytics. Passionate about mentoring in tech.",
    location: "Seattle, WA",
    timezone: "PST",
    expertise: ["Data Science", "Machine Learning", "Analytics"],
    maxMentees: 3,
    currentMentees: 1,
    programDuration: "12",
    rating: 4.7,
    totalMentees: 12,
    avatar: null,
    available: true,
  },
  {
    id: "5",
    name: "Tobi Olaide",
    bio: "Senior frontend engineer focused on building delightful experiences and mentoring new developers.",
    location: "Lagos, NG",
    timezone: "WAT",
    expertise: ["Frontend", "React", "TypeScript", "UI/UX"],
    maxMentees: 4,
    currentMentees: 1,
    programDuration: "3",
    rating: 4.8,
    totalMentees: 18,
    avatar: null,
    available: true,
  },
]
