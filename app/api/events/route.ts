import { NextResponse } from "next/server"

// This would be replaced with actual database queries in a real implementation
export async function GET(request: Request) {
  // Mock data for events
  const events = [
    {
      id: "101",
      title: "Taylor Swift - The Eras Tour",
      image: "/placeholder.svg?height=400&width=600",
      date: "Aug 5, 2023",
      location: "SoFi Stadium, Los Angeles, CA",
      priceRange: "$350 - $1,200",
      priceChange: "+15.3%",
      category: "concerts",
      description: "Experience Taylor Swift's record-breaking Eras Tour, a journey through her musical career.",
    },
    {
      id: "102",
      title: "NBA Finals 2023 - Game 7",
      image: "/placeholder.svg?height=400&width=600",
      date: "Jun 18, 2023",
      location: "TD Garden, Boston, MA",
      priceRange: "$500 - $2,500",
      priceChange: "+32.7%",
      category: "sports",
      description: "Witness the climactic Game 7 of the NBA Finals as two teams battle for the championship.",
    },
    {
      id: "103",
      title: "Coachella Valley Music and Arts Festival",
      image: "/placeholder.svg?height=400&width=600",
      date: "Apr 14-23, 2023",
      location: "Empire Polo Club, Indio, CA",
      priceRange: "$450 - $1,000",
      priceChange: "-5.2%",
      category: "festivals",
      description: "Join the world-famous Coachella Festival featuring top artists across multiple genres.",
    },
  ]

  // In a real implementation, you would parse query parameters and filter results
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let filteredEvents = events
  if (category) {
    filteredEvents = events.filter((event) => event.category === category)
  }

  return NextResponse.json(filteredEvents)
}

