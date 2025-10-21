import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  location: string
  event_type: string
  date: string
  end_date?: string
  price: number
  is_free: boolean
  max_attendees?: number
  image_url?: string
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          <Badge variant={event.is_free ? "secondary" : "default"}>
            {event.is_free ? "Free" : `£${event.price}`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(eventDate, "MMM d, yyyy 'at' h:mm a")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="capitalize whitespace-nowrap">{event.event_type}</span>
            <span>•</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {event.max_attendees && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max {event.max_attendees} attendees</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>
            {isUpcoming ? "View Details" : "View Event"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
