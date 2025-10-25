"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AttendEventButtonProps {
  eventId: string
  isFree: boolean
  price: number
  isLoggedIn: boolean
}

export function AttendEventButton({ eventId, isFree, price, isLoggedIn }: AttendEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()
  const router = useRouter()

  const handleAttend = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (isFree) {
        // For free events, create booking directly
        const { error } = await supabase
          .from("bookings")
          .insert({
            event_id: eventId,
            user_id: user.id,
            status: "confirmed",
            payment_status: "completed",
          })

        if (error) throw error

        router.refresh()
      } else {
        // For paid events, redirect to checkout
        router.push(`/events/${eventId}/checkout`)
      }
    } catch (err) {
      console.error("Error registering for event:", err)
      setError("Failed to register for event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAttend} className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : isFree ? "Attend Free Event" : `Pay £${price} to Attend`}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
