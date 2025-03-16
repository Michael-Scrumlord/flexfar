import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Ticket, Calendar, Bell } from "lucide-react"
import FeaturedEvents from "@/components/featured-events"
import TrendingTickets from "@/components/trending-tickets"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FlexFare</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-sm font-medium hover:text-primary">
              Events
            </Link>
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary">
              Marketplace
            </Link>
            <Link href="/watchlist" className="text-sm font-medium hover:text-primary">
              Watchlist
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Buy, Sell, and Trade Event Tickets
                </h1>
                <h3>Fare Tickets.</h3>
                <h3>Fair Prices.</h3>
                <p className="text-muted-foreground md:text-xl">
                  FlexFare is the first platform that lets you trade event tickets like stocks. Watch prices rise and
                  fall, set alerts, and make the most of your ticket investments.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/events">
                    <Button size="lg" className="w-full sm:w-auto">
                      Browse Events
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Enter Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:pl-10">
                <div className="relative overflow-hidden rounded-xl border bg-background p-2">
                  <div className="flex items-center justify-between rounded-md bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      <span className="text-sm font-medium">Ticket Exchange</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-green-500">+12.4%</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-3 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Taylor Swift - The Eras Tour</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Aug 5, 2023 • Los Angeles, CA</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">$450.00</div>
                          <div className="text-xs text-green-500">+$32.50 (7.8%)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="text-muted-foreground md:text-xl">
                  FlexFare combines the excitement of ticket purchasing with the strategy of stock trading
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              {[
                {
                  icon: <Ticket className="h-10 w-10 text-primary" />,
                  title: "Buy Tickets",
                  description: "Purchase tickets to your favorite events directly from organizers or other users.",
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "Watch the Market",
                  description: "Monitor ticket prices as they fluctuate based on demand, timing, and other factors.",
                },
                {
                  icon: <Bell className="h-10 w-10 text-primary" />,
                  title: "Set Alerts",
                  description:
                    "Create custom alerts for price movements and get notified when it's time to buy or sell.",
                },
              ].map((item, i) => (
                <Card key={i} className="border-none">
                  <CardHeader>
                    <div className="mb-2">{item.icon}</div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Events</h2>
                <p className="text-muted-foreground md:text-xl">
                  Discover the hottest events with the most active ticket trading
                </p>
              </div>
            </div>
            <div className="mt-8">
              <FeaturedEvents />
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trending Tickets</h2>
                <p className="text-muted-foreground md:text-xl">
                  See which tickets are experiencing the biggest price movements
                </p>
              </div>
            </div>
            <div className="mt-8">
              <TrendingTickets />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 FlexFare. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

