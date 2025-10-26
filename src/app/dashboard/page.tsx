import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Calendar, Plus, Users } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's created events
  const { data: createdEvents } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })

  // Get user's bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      events (*)
    `)
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .order("created_at", { ascending: false })

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your events and bookings</p>
            </div>
            <Button asChild>
              <Link href="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Created Events */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
            {createdEvents && createdEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardDescription>You haven&apos;t created any events yet.</CardDescription>
                  <Button asChild className="mt-4">
                    <Link href="/events/create">Create your first event</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Booked Events */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
            {bookings && bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking: { id: string; events: { id: string; title: string; description: string; date: string; event_type: string; location: string; price: number; is_free: boolean; max_attendees?: number; image_url?: string } }) => (
                  <EventCard key={booking.id} event={booking.events} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardDescription>You haven&apos;t booked any events yet.</CardDescription>
                  <Button asChild className="mt-4">
                    <Link href="/">Browse events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
