import { NextResponse } from "next/server"
import { addEventToPrimaryCalendar } from "@/lib/google/calendar"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { summary, description, location, startISO, endISO, timezone } = body

  if (!summary || !startISO || !endISO) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await addEventToPrimaryCalendar({
    userId: user.id,
    summary,
    description,
    location,
    start: new Date(startISO),
    end: new Date(endISO),
    timezone,
  })

  return NextResponse.json({ ok: true })
}
