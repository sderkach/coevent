import { NextResponse } from "next/server"
import { exchangeCodeForTokens, upsertUserTokens } from "@/lib/google/calendar"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL))
  if (!code) return NextResponse.redirect(new URL("/auth/error", process.env.NEXT_PUBLIC_SITE_URL))

  const tokens = await exchangeCodeForTokens(code)
  await upsertUserTokens(user.id, tokens)

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_SITE_URL))
}
