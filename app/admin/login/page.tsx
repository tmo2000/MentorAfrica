"use server"

import { redirect } from "next/navigation"

export default async function AdminLoginRedirect() {
  redirect("/auth/login?role=admin&roleLocked=true")
}
