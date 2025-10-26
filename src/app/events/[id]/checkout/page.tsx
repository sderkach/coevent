"use client"

import { useState, useEffect } from "react"
import { startCheckoutSession } from "@/app/actions/stripe"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder")

function CheckoutForm({ eventId }: { eventId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError("")

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })
    
    // If payment requires no redirect (payment method confirmed server-side), redirect manually
    if (!error && paymentIntent) {
      window.location.href = `/events/${eventId}/checkout/success?payment_intent=${paymentIntent.id}`
    }

    if (error) {
      setError(error.message || "An error occurred")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  )
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [eventId, setEventId] = useState("")

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const { id } = await params
        setEventId(id)
        
        // Check if Stripe is configured
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          setError("Stripe is not configured. Please contact the administrator.")
          return
        }
        
        const secret = await startCheckoutSession(id)
        if (!secret) {
          setError("Failed to start checkout session")
          return
        }
        setClientSecret(secret)
      } catch (err: unknown) {
        console.error("Error initializing checkout:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    getClientSecret()
  }, [params])

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-lg">Loading checkout...</div>
          </CardContent>
        </Card>
        </div>
      </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-destructive">{error}</div>
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
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Enter your payment details to complete your event registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm eventId={eventId} />
          </Elements>
        </CardContent>
      </Card>
        </div>
      </div>
      </>
  )
}
