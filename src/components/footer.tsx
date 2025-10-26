import { Calendar } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2 w-fit">
              <Calendar className="h-6 w-6" />
              <span className="text-xl font-bold">CoEvent</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover and create amazing events in your community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Browse Events
              </Link>
              <Link href="/events/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Create Event
              </Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Sign In
              </Link>
              <Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Community</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                Dashboard
              </Link>
              <p className="text-sm text-muted-foreground">
                Join thousands of event-goers and organizers building amazing communities.
              </p>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} CoEvent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
