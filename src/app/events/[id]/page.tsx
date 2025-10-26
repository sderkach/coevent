import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, User, Edit } from "lucide-react"
import { format } from "date-fns"
import { redirect } from "next/navigation"
import { AttendEventButton } from "@/components/attend-event-button"
import { CancelRegistrationButton } from "@/components/cancel-registration-button"
import { AddToGoogleCalendarButton } from "@/components/add-to-google-calendar-button"
import Link from "next/link"

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (eventError) {
    console.error("Event query error:", eventError)
    redirect("/")
  }

  if (!event) {
    redirect("/")
  }

  // Fetch organizer profile separately
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", event.organizer_id)
    .single()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is already registered
  let isRegistered = false
  if (user) {
    const { data: booking } = await supabase
      .from("bookings")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .single()

    isRegistered = !!booking
  }

  // Get attendee count
  const { count: attendeeCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id)
    .eq("status", "confirmed")

  const eventDate = new Date(event.date)
  const eventEnd = event.end_date ? new Date(event.end_date) : new Date(eventDate.getTime() + 60 * 60 * 1000)
  const isOrganizer = user?.id === event.organizer_id

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Event Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {event.image_url ? (
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Calendar className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-balance">{event.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Organized by {profile?.display_name || "Unknown Organizer"}</span>
                    </div>
                  </div>
                  <Badge variant={event.is_free ? "secondary" : "default"} className="text-base px-3 py-1">
                    {event.is_free ? "Free" : `£${event.price}`}
                  </Badge>
                </div>

                {isOrganizer && (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/events/${event.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="prose prose-sm max-w-none">
                <h2 className="text-xl font-semibold">About this event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium">{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-sm text-muted-foreground">{format(eventDate, "h:mm a")}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium capitalize">{event.event_type}</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>

                    {event.max_attendees && (
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium">
                            {attendeeCount || 0} / {event.max_attendees} attendees
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.max_attendees - (attendeeCount || 0)} spots left
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    {isOrganizer ? (
                      <Button className="w-full" disabled>
                        You&apos;re the organizer
                      </Button>
                    ) : isRegistered ? (
                      <CancelRegistrationButton eventId={event.id} />
                    ) : (
                      <AttendEventButton
                        eventId={event.id}
                        isFree={event.is_free}
                        price={event.price}
                        isLoggedIn={!!user}
                      />
                    )}
                  </div>

                  <div className="pt-4">
                    {(isRegistered || isOrganizer) && (
                      <AddToGoogleCalendarButton
                        eventId={event.id}
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        startISO={eventDate.toISOString()}
                        endISO={eventEnd.toISOString()}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
