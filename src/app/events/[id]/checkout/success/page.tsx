import { createClient } from "@/lib/supabase/server"
import { verifyPayment } from "@/app/actions/stripe"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CheckoutSuccessPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { id } = await params
  const { session_id } = await searchParams
  const supabase = await createClient()

  if (!session_id) {
    redirect(`/events/${id}`)
  }

  // Verify payment and create booking
  try {
    await verifyPayment(session_id)
  } catch (error) {
    console.error("Payment verification error:", error)
  }

  // Fetch event details
  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  if (!event) {
    redirect("/")
  }

  const eventDate = new Date(event.date)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                You&apos;ve successfully registered for this event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(eventDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive a confirmation email shortly. You can also view this event in your dashboard.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/events/${id}`}>View Event</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
