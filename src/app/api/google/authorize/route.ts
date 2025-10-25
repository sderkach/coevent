import { NextResponse } from "next/server"
import { getConsentUrl } from "@/lib/google/calendar"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login with a redirect back to this flow
    const url = new URL(request.url)
    const callbackUrl = url.searchParams.get('callback') || url.searchParams.get('from')
    const loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || url.origin)
    if (callbackUrl) {
      loginUrl.searchParams.set('callback', callbackUrl)
    }
    return NextResponse.redirect(loginUrl)
  }

  const consentUrl = getConsentUrl("state_unused")
  return NextResponse.redirect(consentUrl)
}
