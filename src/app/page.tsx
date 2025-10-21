import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { seedEvents } from "@/lib/seed-events"
import Link from "next/link"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Seed events if none exist
  await seedEvents()

  // Build query
  let query = supabase
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })

  // Apply filters
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,location.ilike.%${params.search}%`,
    )
  }

  if (params.type && params.type !== "all") {
    query = query.eq("event_type", params.type)
  }

  const { data: events, error } = await query

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Discover Amazing Events Near You</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of people attending events, workshops, and meetups. Create your own events and build your
            community.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="max-w-3xl mx-auto">
          <form action="/" method="get" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="search" placeholder="Search events..." defaultValue={params.search} className="pl-9" />
            </div>
            <Select name="type" defaultValue={params.type || "all"}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </section>

        {/* Events Grid */}
        <section>
          {error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-muted-foreground">No events found matching your criteria.</p>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Welcome to CoEvent! This is a fresh installation with no events yet.
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            To get started, you can:
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                              <Link href="/auth/signup">Sign Up & Create Events</Link>
                            </Button>
                            <Button asChild variant="outline">
                              <Link href="/auth/login">Sign In</Link>
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>For Demo Purposes:</strong> If you want to see sample events, 
                            sign up for an account and the system will automatically create sample events for you to explore.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
        </section>
      </main>
    </>
  )
}