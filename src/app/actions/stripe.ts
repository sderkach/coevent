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

  // Create PaymentIntent for embedded checkout
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(event.price * 100), // Convert to pence
    currency: "gbp",
    metadata: {
      event_id: eventId,
      user_id: user.id,
      event_title: event.title,
      event_description: event.description.substring(0, 500),
    },
  })

  // Create booking with pending status
  await supabase.from("bookings").insert({
    event_id: eventId,
    user_id: user.id,
    status: "pending",
    payment_status: "pending",
    stripe_payment_intent_id: paymentIntent.id,
  })

  return paymentIntent.client_secret!
}

export async function verifyPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.status === "succeeded") {
    const supabase = await createClient()

    // Update booking status to confirmed
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "completed",
      })
      .eq("stripe_payment_intent_id", paymentIntentId)

    if (error) {
      console.error("Error updating booking:", error)
      throw new Error("Failed to update booking")
    }

    return true
  }

  return false
}
