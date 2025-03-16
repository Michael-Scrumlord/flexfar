import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Clock,
  Bell,
  Share2,
  Heart,
  DollarSign,
  BarChart4,
  Users,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  // In a real implementation, this would fetch ticket data from the API
  const ticket = {
    id: params.id,
    eventTitle: "Taylor Swift - The Eras Tour",
    section: "Floor A, Row 10",
    date: "Aug 5, 2023",
    time: "7:00 PM",
    location: "SoFi Stadium, Los Angeles, CA",
    currentPrice: "$750.00",
    priceChange: "+$125.00",
    percentChange: "+20.0%",
    trending: "up",
    highestPrice: "$850.00",
    lowestPrice: "$450.00",
    openingPrice: "$625.00",
    volume: "324 trades today",
    marketCap: "$2.4M",
    description:
      "Experience Taylor Swift's record-breaking Eras Tour from premium floor seats. These tickets are in high demand and have been steadily increasing in value as the event date approaches.",
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
            ← Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{ticket.eventTitle}</h1>
          <p className="text-muted-foreground mt-1">{ticket.section}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>30-day price history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Price chart visualization would go here</p>
              </div>
              <div className="flex justify-center mt-4">
                <Tabs defaultValue="1m">
                  <TabsList>
                    <TabsTrigger value="1d">1D</TabsTrigger>
                    <TabsTrigger value="1w">1W</TabsTrigger>
                    <TabsTrigger value="1m">1M</TabsTrigger>
                    <TabsTrigger value="3m">3M</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">{ticket.currentPrice}</p>
                    <p
                      className={`text-sm font-medium flex items-center ${ticket.trending === "up" ? "text-green-500" : "text-red-500"}`}
                    >
                      {ticket.priceChange} ({ticket.percentChange})
                      {ticket.trending === "up" ? (
                        <TrendingUp className="h-4 w-4 ml-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 ml-1" />
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">24h Range</p>
                    <p className="text-lg font-medium">{ticket.lowestPrice}</p>
                    <p className="text-lg font-medium">{ticket.highestPrice}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Opening Price</p>
                    <p className="text-lg font-medium">{ticket.openingPrice}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-lg font-medium">{ticket.volume}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Recent Trades</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {i} hour{i !== 1 ? "s" : ""} ago
                          </span>
                        </div>
                        <div className="text-sm font-medium">${750 - i * 5}.00</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.date} at {ticket.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{ticket.location}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm">{ticket.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade This Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price per Ticket</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="text" className="pl-8" defaultValue="750.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Cost</label>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">$750.00</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Service Fee</span>
                        <span className="text-sm font-medium">$37.50</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Processing Fee</span>
                        <span className="text-sm font-medium">$12.50</span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">$800.00</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Buy Now</Button>
                </TabsContent>
                <TabsContent value="sell" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ask Price per Ticket</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="text" className="pl-8" defaultValue="750.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Payout</label>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">$750.00</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Seller Fee</span>
                        <span className="text-sm font-medium">-$37.50</span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <span className="font-medium">You Receive</span>
                        <span className="font-bold">$712.50</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">List for Sale</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Price Prediction</p>
                  <p className="text-sm text-green-500">Likely to increase by 5-10% before event</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Demand</p>
                  <p className="text-sm text-muted-foreground">Very High - 250+ watchers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Risk Level</p>
                  <p className="text-sm text-muted-foreground">Low - Established event with strong history</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Link href={`/marketplace/ticket/${i}`} key={i}>
                  <div className="flex justify-between items-center py-2 border-b last:border-0 hover:bg-muted/50 px-2 rounded-md">
                    <div>
                      <p className="font-medium text-sm">Floor A, Row {10 + i}</p>
                      <p className="text-xs text-muted-foreground">{ticket.eventTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${750 + i * 25}.00</p>
                      <p className={`text-xs ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                        {i % 2 === 0 ? "+" : "-"}
                        {i * 2}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

