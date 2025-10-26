"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"

export default function EditEventPage() {
  const params = useParams()
  const eventId = params.id as string
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    event_type: "in-person",
    date: "",
    end_date: "",
    price: "0",
    max_attendees: "",
    image_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: event, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single()

        if (fetchError) throw fetchError

        // Check if user is the organizer
        if (event.organizer_id !== user.id) {
          router.push(`/events/${eventId}`)
          return
        }

        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          event_type: event.event_type,
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
          end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
          price: event.price.toString(),
          max_attendees: event.max_attendees ? event.max_attendees.toString() : "",
          image_url: event.image_url || "",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [eventId, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to edit events")

      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        is_free: parseFloat(formData.price) === 0,
      }

      const { error: updateError } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", eventId)

      if (updateError) throw updateError

      router.push(`/events/${eventId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)

      if (error) throw error

      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-lg">Loading event...</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
              <CardDescription>
                Update the details of your event below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_type">Event Type</Label>
                    <Select value={formData.event_type} onValueChange={(value) => handleChange("event_type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (£)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder={formData.event_type === "online" ? "Zoom link, Discord, etc." : "Venue address"}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date & Time</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date & Time (optional)</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
                    <Input
                      id="max_attendees"
                      type="number"
                      min="1"
                      value={formData.max_attendees}
                      onChange={(e) => handleChange("max_attendees", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleChange("image_url", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Saving..." : "Update Event"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

