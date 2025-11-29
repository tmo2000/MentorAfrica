"use client"

import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Users, HelpCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"

export default function FaqPage() {
  const { user, logout } = useAuth()
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const faqs = [
    {
      q: "How do I become a mentor?",
      a: "Sign up as a mentor, complete onboarding, and our team will review and approve your profile before you are listed.",
    },
    {
      q: "How do mentee applications work?",
      a: "Mentees browse mentors, submit an application, and mentors review and accept based on fit and availability.",
    },
    {
      q: "Can I change my mentor after applying?",
      a: "If your application is pending or declined, you can apply to another mentor. Active mentees can request a change through support.",
    },
    {
      q: "What is the typical program length?",
      a: "Programs run 3, 6, or 12 months depending on the mentor's offering and your agreed plan.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/mentors">
                <Button variant="ghost">Our Mentors</Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost">FAQs</Button>
              </Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={user.role === "mentor" ? "/mentor/dashboard" : "/settings"}
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== "mentor" && (
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Track application
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600" onSelect={() => logout()}>
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Answers to common questions</h1>
          <p className="text-gray-600">No account needed—browse freely.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg bg-white shadow-sm px-4">
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pb-4">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}
