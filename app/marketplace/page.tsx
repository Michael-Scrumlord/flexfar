import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Filter, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Marketplace</h1>
          <p className="text-muted-foreground mt-1">Buy, sell, and trade tickets like stocks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            My Watchlist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search events or artists..." className="pl-8" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="concerts">Concerts</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="festivals">Festivals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="newyork">New York</SelectItem>
                    <SelectItem value="losangeles">Los Angeles</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="miami">Miami</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="thisweek">This Week</SelectItem>
                    <SelectItem value="thismonth">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Trend</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Trends" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trends</SelectItem>
                    <SelectItem value="rising">Rising Prices</SelectItem>
                    <SelectItem value="falling">Falling Prices</SelectItem>
                    <SelectItem value="volatile">Highly Volatile</SelectItem>
                    <SelectItem value="stable">Stable Prices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Market Movers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Biggest Gainers</div>
                {[1, 2, 3].map((i) => (
                  <Link href={`/marketplace/ticket/${i}`} key={`gain-${i}`}>
                    <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md">
                      <div className="text-sm truncate max-w-[180px]">Taylor Swift - NYC Night {i}</div>
                      <div className="flex items-center text-green-500 text-sm font-medium">
                        +{12 + i}%
                        <TrendingUp className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Biggest Losers</div>
                {[1, 2, 3].map((i) => (
                  <Link href={`/marketplace/ticket/${i}`} key={`loss-${i}`}>
                    <div className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded-md">
                      <div className="text-sm truncate max-w-[180px]">NBA Finals - Game {i}</div>
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        -{8 + i}%
                        <TrendingDown className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="new">New Listings</TabsTrigger>
                <TabsTrigger value="ending">Ending Soon</TabsTrigger>
              </TabsList>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="date-asc">Date: Soonest</SelectItem>
                  <SelectItem value="date-desc">Date: Latest</SelectItem>
                  <SelectItem value="trend-asc">Trend: Rising</SelectItem>
                  <SelectItem value="trend-desc">Trend: Falling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold">Event Title {i}</h3>
                          <p className="text-sm text-muted-foreground">Section A, Row {i}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Jun {10 + i}, 2023</span>
                            <span>•</span>
                            <span>New York, NY</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${350 + i * 50}.00</div>
                          <div
                            className={`flex items-center justify-end gap-1 ${i % 2 === 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            <span className="text-xs font-medium">
                              {i % 2 === 0 ? "+" : "-"}${10 + i}.00 ({i % 2 === 0 ? "+" : "-"}
                              {3 + i}%)
                            </span>
                            {i % 2 === 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Watch
                            </Button>
                            <Link href={`/marketplace/ticket/${i}`}>
                              <Button size="sm" className="text-xs">
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
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
            <TabsContent value="trending" className="mt-0">
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">Trending tickets content would go here</p>
              </div>
            </TabsContent>
            <TabsContent value="new" className="mt-0">
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">New listings content would go here</p>
              </div>
            </TabsContent>
            <TabsContent value="ending" className="mt-0">
              <div className="flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">Ending soon content would go here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

