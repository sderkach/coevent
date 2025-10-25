"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  eventId: string
  title: string
  description?: string
  location?: string
  startISO: string
  endISO: string
}

export function AddToGoogleCalendarButton({ title, description, location, startISO, endISO }: Props) {
  const [loading, setLoading] = useState(false)

  async function onClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/google/add-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: title,
          description,
          location,
          startISO,
          endISO,
        }),
      })

      if (res.status === 401) {
        window.location.href = `/api/google/authorize?callback=${encodeURIComponent(window.location.href)}`
        return
      }

      if (!res.ok) throw new Error("Failed to add to calendar")
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={onClick} variant="outline" className="w-full" disabled={loading}>
      {loading ? "Adding..." : "Add to Google Calendar"}
    </Button>
  )
}
