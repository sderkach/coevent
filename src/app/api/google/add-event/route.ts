import { NextResponse } from "next/server"
import { addEventToPrimaryCalendar } from "@/lib/google/calendar"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { summary, description, location, startISO, endISO, timezone } = body

    if (!summary || !startISO || !endISO) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

    try {
      await addEventToPrimaryCalendar({
        userId: user.id,
        summary,
        description,
        location,
        start: new Date(startISO),
        end: new Date(endISO),
        timezone,
      })
    } catch (calendarError) {
      // If user hasn't connected Google account, redirect to authorize
      if (calendarError instanceof Error && calendarError.message === "Google account not connected") {
        return NextResponse.json({ error: "Not connected to Google" }, { status: 401 })
      }
      throw calendarError
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error adding event to Google Calendar:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add event to calendar" },
      { status: 500 }
    )
  }
}
