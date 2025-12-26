"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, Users, X, LogOut, Settings, User } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/mentors", label: "Our Mentors" },
  { href: "/faq", label: "FAQs" },
]

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase() || ""

function Brand() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
        <Users className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">MentorAfrica</span>
    </Link>
  )
}

export function SiteHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const initials = getInitials(user?.name)

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileOpen(false)
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Brand />

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="font-medium text-gray-700 hover:text-gray-900">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-2">
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
                      <Link href={user.role === "mentor" ? "/mentor/dashboard" : "/settings"} className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== "mentor" && (
                      <DropdownMenuItem asChild>
                        <Link href="/applications" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Track application
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-red-600" onSelect={handleLogout}>
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

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white/95 sm:max-w-xs">
                <SheetHeader className="space-y-0 pb-4">
                  <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
                  <div className="flex items-center justify-between">
                    <Brand />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close navigation</span>
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                <div className="space-y-4">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link href={link.href}>
                          <Button variant="ghost" className="w-full justify-start text-base">
                            {link.label}
                          </Button>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="border-t pt-4 space-y-3">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || undefined} alt={user.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <SheetClose asChild>
                            <Link
                              href={user.role === "mentor" ? "/mentor/dashboard" : "/settings"}
                              className="flex items-center gap-2"
                            >
                              <Button variant="outline" className="w-full justify-start">
                                <Settings className="h-4 w-4" />
                                Profile & Settings
                              </Button>
                            </Link>
                          </SheetClose>
                          {user.role !== "mentor" && (
                            <SheetClose asChild>
                              <Link href="/applications" className="flex items-center gap-2">
                                <Button variant="outline" className="w-full justify-start">
                                  <User className="h-4 w-4" />
                                  Track application
                                </Button>
                              </Link>
                            </SheetClose>
                          )}
                          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Log out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="grid gap-2">
                        <SheetClose asChild>
                          <Link href="/auth/login">
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth/register">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                              Get Started
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
