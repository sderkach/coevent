import { createClient } from "@/lib/supabase/server"

const sampleEvents = [
  {
    title: "Tech Meetup: Next.js 14 Deep Dive",
    description: "Join us for an in-depth exploration of Next.js 14 features, including the new App Router, Server Components, and performance improvements. Perfect for developers looking to stay up-to-date with modern React development.",
    location: "Tech Hub Downtown",
    event_type: "in-person",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    price: 0,
    is_free: true,
    max_attendees: 50,
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
  },
  {
    title: "Virtual Design Workshop",
    description: "Learn the fundamentals of UI/UX design in this hands-on workshop. We'll cover user research, wireframing, prototyping, and design systems. Bring your laptop and creativity!",
    location: "Zoom Meeting",
    event_type: "online",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    price: 25,
    is_free: false,
    max_attendees: 30,
    image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
  },
  {
    title: "Community Garden Volunteer Day",
    description: "Help us maintain our community garden! We'll be planting vegetables, weeding, and learning about sustainable gardening practices. All skill levels welcome. Tools and refreshments provided.",
    location: "Community Garden - 123 Green Street",
    event_type: "in-person",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
    price: 0,
    is_free: true,
    max_attendees: 25,
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
  },
  {
    title: "Photography Masterclass",
    description: "Professional photographer Sarah Johnson will teach advanced photography techniques including composition, lighting, and post-processing. Bring your camera and questions!",
    location: "Art Gallery Studio",
    event_type: "in-person",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 hours later
    price: 75,
    is_free: false,
    max_attendees: 15,
    image_url: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=400&fit=crop",
  },
  {
    title: "Book Club: Sci-Fi Discussion",
    description: "Join our monthly book club discussion of 'The Martian' by Andy Weir. We'll explore themes of survival, science, and human resilience. New members always welcome!",
    location: "Public Library - Meeting Room A",
    event_type: "in-person",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
    end_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hours later
    price: 0,
    is_free: true,
    max_attendees: 20,
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
  },
  {
    title: "Cooking Class: Italian Cuisine",
    description: "Learn to make authentic Italian pasta and sauces from scratch! Chef Marco will guide you through traditional techniques. All ingredients and equipment provided.",
    location: "Culinary School Kitchen",
    event_type: "in-person",
    date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
    end_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    price: 45,
    is_free: false,
    max_attendees: 12,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
  },
]

export async function seedEvents() {
  const supabase = await createClient()

  // Check if events already exist
  const { data: existingEvents } = await supabase
    .from("events")
    .select("id")
    .limit(1)

  if (existingEvents && existingEvents.length > 0) {
    console.log("Events already exist, skipping seed")
    return
  }

  // Get a user to be the organizer
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.log("No user found, skipping seeding for non-authenticated users")
    return
  }

  // Insert sample events with the logged-in user as organizer
  const eventsWithOrganizer = sampleEvents.map(event => ({
    ...event,
    organizer_id: user.id,
  }))

  const { error } = await supabase
    .from("events")
    .insert(eventsWithOrganizer)

  if (error) {
    console.error("Error seeding events:", error)
  } else {
    console.log("Successfully seeded sample events")
  }
}
