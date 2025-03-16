import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Calendar, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"

// This component would normally fetch data from the API
export default function TrendingTickets() {
  // Mock data - in a real implementation, this would come from an API call
  const tickets = [
    {
      id: 1,
      eventTitle: "Taylor Swift - The Eras Tour",
      section: "Floor A, Row 10",
      date: "Aug 5, 2023",
      location: "Los Angeles, CA",
      currentPrice: "$750.00",
      priceChange: "+$125.00",
      percentChange: "+20.0%",
      trending: "up",
    },
    {
      id: 2,
      eventTitle: "NBA Finals 2023 - Game 7",
      section: "Section 112, Row 15",
      date: "Jun 18, 2023",
      location: "Boston, MA",
      currentPrice: "$1,850.00",
      priceChange: "+$450.00",
      percentChange: "+32.1%",
      trending: "up",
    },
    {
      id: 3,
      eventTitle: "Coachella Valley Music and Arts Festival",
      section: "VIP Weekend 1",
      date: "Apr 14-16, 2023",
      location: "Indio, CA",
      currentPrice: "$850.00",
      priceChange: "-$50.00",
      percentChange: "-5.6%",
      trending: "down",
    },
    {
      id: 4,
      eventTitle: "Beyoncé - Renaissance World Tour",
      section: "Section B, Row 20",
      date: "Jul 12, 2023",
      location: "Philadelphia, PA",
      currentPrice: "$550.00",
      priceChange: "+$75.00",
      percentChange: "+15.8%",
      trending: "up",
    },
  ]

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{ticket.eventTitle}</h3>
                <p className="text-sm text-muted-foreground">{ticket.section}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{ticket.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{ticket.currentPrice}</div>
                <div
                  className={`flex items-center justify-end gap-1 ${ticket.trending === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  <span className="text-sm font-medium">
                    {ticket.priceChange} ({ticket.percentChange})
                  </span>
                  {ticket.trending === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Alert
                  </Button>
                  <Link href={`/marketplace/ticket/${ticket.id}`}>
                    <Button size="sm" className="w-full">
                      Trade
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

