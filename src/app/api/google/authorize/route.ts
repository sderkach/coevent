import { NextResponse } from "next/server"
import { getConsentUrl } from "@/lib/google/calendar"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL))

  const consentUrl = getConsentUrl("state_unused")
  return NextResponse.redirect(consentUrl)
}
