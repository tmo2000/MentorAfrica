"use server"

import { redirect } from "next/navigation"

export default async function AdminSignupRedirect() {
  redirect("/auth/register?role=admin&roleLocked=true")
}
