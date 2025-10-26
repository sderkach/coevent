"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CancelRegistrationButtonProps {
  eventId: string
}

export function CancelRegistrationButton({ eventId }: CancelRegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your registration for this event?")) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error("Error canceling registration:", err)
      setError("Failed to cancel registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleCancel} variant="outline" className="w-full" disabled={isLoading}>
        {isLoading ? "Canceling..." : "Cancel Registration"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

