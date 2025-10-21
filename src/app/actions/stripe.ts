"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function startCheckoutSession(eventId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User must be authenticated")
  }

  // Fetch event details
  const { data: event, error } = await supabase.from("events").select("*").eq("id", eventId).single()

  if (error || !event) {
    throw new Error("Event not found")
  }

  if (event.is_free) {
    throw new Error("This event is free")
  }

  // Check if user is already registered
  const { data: existingBooking } = await supabase
    .from("bookings")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single()

  if (existingBooking) {
    throw new Error("Already registered for this event")
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: event.title,
            description: event.description.substring(0, 500),
          },
          unit_amount: Math.round(event.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/events/${eventId}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      event_id: eventId,
      user_id: user.id,
    },
  })

  return session.client_secret
}

export async function verifyPayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === "paid") {
    const supabase = await createClient()

    // Create booking
    const { error } = await supabase.from("bookings").insert({
      event_id: session.metadata?.event_id,
      user_id: session.metadata?.user_id,
      status: "confirmed",
      payment_status: "completed",
      stripe_payment_intent_id: session.payment_intent as string,
    })

    if (error) {
      console.error("Error creating booking:", error)
      throw new Error("Failed to create booking")
    }

    return true
  }

  return false
}
