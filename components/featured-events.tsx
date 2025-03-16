import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"

// This component would normally fetch data from the API
export default function FeaturedEvents() {
  // Mock data - in a real implementation, this would come from an API call
  const events = [
    {
      id: 1,
      title: "Taylor Swift - The Eras Tour",
      image: "/placeholder.svg?height=400&width=600",
      date: "Aug 5, 2023",
      location: "SoFi Stadium, Los Angeles, CA",
      priceRange: "$350 - $1,200",
      priceChange: "+15.3%",
    },
    {
      id: 2,
      title: "NBA Finals 2023 - Game 7",
      image: "/placeholder.svg?height=400&width=600",
      date: "Jun 18, 2023",
      location: "TD Garden, Boston, MA",
      priceRange: "$500 - $2,500",
      priceChange: "+32.7%",
    },
    {
      id: 3,
      title: "Coachella Valley Music and Arts Festival",
      image: "/placeholder.svg?height=400&width=600",
      date: "Apr 14-23, 2023",
      location: "Empire Polo Club, Indio, CA",
      priceRange: "$450 - $1,000",
      priceChange: "-5.2%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="aspect-[16/9] relative">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Price Range:</span>
                <span className="ml-1">{event.priceRange}</span>
              </div>
              <div
                className={`text-sm font-medium ${event.priceChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
              >
                {event.priceChange}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Link href={`/marketplace/event/${event.id}`} className="flex-1">
              <Button className="w-full">Trade Tickets</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

