// Pricing Engine Service
import { getEventBus, EventType } from "./event-bus"

export interface PricingFactor {
  name: string
  weight: number
  calculate: (ticketData: any, marketData: any) => number
}

export class PricingEngine {
  private factors: PricingFactor[] = []
  private eventBus = getEventBus()

  constructor() {
    this.registerDefaultFactors()
    this.subscribeToEvents()
  }

  // Register a new pricing factor
  public registerFactor(factor: PricingFactor): void {
    this.factors.push(factor)
    console.log(`Registered pricing factor: ${factor.name} with weight ${factor.weight}`)
  }

  // Calculate the suggested price for a ticket
  public async calculatePrice(ticketData: any): Promise<PricingResult> {
    try {
      console.log(`Calculating price for ticket: ${JSON.stringify(ticketData)}`)

      // Fetch market data
      const marketData = await this.fetchMarketData(ticketData.eventId)

      // Calculate base price
      const basePrice = ticketData.basePrice || marketData.averagePrice || 100

      // Apply each pricing factor
      let adjustedPrice = basePrice
      const factorBreakdown: FactorImpact[] = []

      for (const factor of this.factors) {
        const factorValue = factor.calculate(ticketData, marketData)
        const factorImpact = basePrice * factorValue * factor.weight

        adjustedPrice += factorImpact

        factorBreakdown.push({
          name: factor.name,
          impact: factorImpact,
          percentage: (factorImpact / basePrice) * 100,
        })
      }

      // Ensure price is not negative
      adjustedPrice = Math.max(adjustedPrice, 1)

      // Round to nearest dollar for simplicity
      adjustedPrice = Math.round(adjustedPrice)

      const result: PricingResult = {
        basePrice,
        suggestedPrice: adjustedPrice,
        confidence: this.calculateConfidence(factorBreakdown),
        factorBreakdown,
      }

      console.log(`Price calculation result: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      console.error("Error calculating price:", error)
      throw error
    }
  }

  // Update price for a ticket and publish event
  public async updatePrice(ticketId: string, newPrice: number, oldPrice: number): Promise<void> {
    try {
      console.log(`Updating price for ticket ${ticketId}: ${oldPrice} -> ${newPrice}`)

      // In a real implementation, this would update the price in the database
      await fetch(`/api/tickets/${ticketId}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: newPrice }),
      })

      // Publish price changed event
      this.eventBus.publish(EventType.PRICE_CHANGED, {
        ticketId,
        oldPrice,
        newPrice,
        percentChange: ((newPrice - oldPrice) / oldPrice) * 100,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Error updating price for ticket ${ticketId}:`, error)
      throw error
    }
  }

  // Get price history for a ticket
  public async getPriceHistory(ticketId: string): Promise<PriceHistoryPoint[]> {
    try {
      console.log(`Fetching price history for ticket ${ticketId}`)

      // In a real implementation, this would fetch from the database
      const response = await fetch(`/api/tickets/${ticketId}/price-history`)

      if (!response.ok) {
        throw new Error(`Failed to fetch price history for ticket ${ticketId}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching price history for ticket ${ticketId}:`, error)
      throw error
    }
  }

  // Get price prediction for a ticket
  public async getPricePrediction(ticketId: string, days = 30): Promise<PricePrediction> {
    try {
      console.log(`Generating price prediction for ticket ${ticketId} for next ${days} days`)

      // In a real implementation, this would use a prediction model
      const response = await fetch(`/api/pricing/predict?ticketId=${ticketId}&days=${days}`)

      if (!response.ok) {
        throw new Error(`Failed to generate price prediction for ticket ${ticketId}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error generating price prediction for ticket ${ticketId}:`, error)
      throw error
    }
  }

  // Private methods
  private registerDefaultFactors(): void {
    // Time to event factor - prices typically increase as the event gets closer
    this.registerFactor({
      name: "Time to Event",
      weight: 0.3,
      calculate: (ticketData, marketData) => {
        const eventDate = new Date(ticketData.eventDate)
        const now = new Date()
        const daysToEvent = Math.max(0, (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        // Closer to event = higher price (inverse relationship)
        if (daysToEvent < 7) {
          return 0.5 // Last week premium
        } else if (daysToEvent < 30) {
          return 0.2 // Last month premium
        } else {
          return -0.1 // Discount for far-future events
        }
      },
    })

    // Demand factor - based on views, watchlists, etc.
    this.registerFactor({
      name: "Demand",
      weight: 0.25,
      calculate: (ticketData, marketData) => {
        const views = marketData.views || 0
        const watchlists = marketData.watchlists || 0

        // Higher views/watchlists = higher price
        if (views > 1000 || watchlists > 100) {
          return 0.4 // High demand
        } else if (views > 500 || watchlists > 50) {
          return 0.2 // Medium demand
        } else {
          return 0 // Normal demand
        }
      },
    })

    // Seat quality factor
    this.registerFactor({
      name: "Seat Quality",
      weight: 0.2,
      calculate: (ticketData, marketData) => {
        // Premium sections get a boost
        const premiumSections = ["Floor", "VIP", "Box", "Front Row"]
        if (premiumSections.some((section) => ticketData.section.includes(section))) {
          return 0.5
        }

        // Lower rows are better
        const row = Number.parseInt(ticketData.row?.replace(/\D/g, "") || "999")
        if (row < 5) {
          return 0.3
        } else if (row < 15) {
          return 0.1
        } else {
          return 0
        }
      },
    })

    // Market trend factor
    this.registerFactor({
      name: "Market Trend",
      weight: 0.15,
      calculate: (ticketData, marketData) => {
        return marketData.priceTrend || 0
      },
    })

    // Seller reputation factor
    this.registerFactor({
      name: "Seller Reputation",
      weight: 0.1,
      calculate: (ticketData, marketData) => {
        const sellerRating = marketData.sellerRating || 3
        return (sellerRating - 3) * 0.1 // 5-star = +0.2, 1-star = -0.2
      },
    })
  }

  private subscribeToEvents(): void {
    // Listen for ticket creation events to calculate initial price
    this.eventBus.subscribe(EventType.TICKET_CREATED, async (data) => {
      try {
        const pricingResult = await this.calculatePrice(data.ticket)
        await this.updatePrice(data.ticket.id, pricingResult.suggestedPrice, data.ticket.price || 0)
      } catch (error) {
        console.error("Error handling ticket created event:", error)
      }
    })

    // Listen for relevant market changes that might affect pricing
    this.eventBus.subscribe(EventType.TICKET_SOLD, async (data) => {
      try {
        // When a ticket is sold, recalculate prices for similar tickets
        const similarTickets = await this.fetchSimilarTickets(data.ticket)

        for (const ticket of similarTickets) {
          const pricingResult = await this.calculatePrice(ticket)
          await this.updatePrice(ticket.id, pricingResult.suggestedPrice, ticket.price)
        }
      } catch (error) {
        console.error("Error handling ticket sold event:", error)
      }
    })
  }

  private async fetchMarketData(eventId: string): Promise<any> {
    try {
      // In a real implementation, this would fetch real market data
      const response = await fetch(`/api/market-data?eventId=${eventId}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch market data for event ${eventId}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching market data for event ${eventId}:`, error)
      // Return default market data
      return {
        averagePrice: 100,
        priceTrend: 0,
        views: 0,
        watchlists: 0,
        sellerRating: 3,
      }
    }
  }

  private async fetchSimilarTickets(ticket: any): Promise<any[]> {
    try {
      // In a real implementation, this would fetch similar tickets
      const response = await fetch(`/api/tickets/similar?ticketId=${ticket.id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch similar tickets for ticket ${ticket.id}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching similar tickets for ticket ${ticket.id}:`, error)
      return []
    }
  }

  private calculateConfidence(factorBreakdown: FactorImpact[]): number {
    // Simple confidence calculation based on factor agreement
    // If factors are pushing in different directions, confidence is lower
    const totalImpact = factorBreakdown.reduce((sum, factor) => sum + Math.abs(factor.impact), 0)
    const netImpact = factorBreakdown.reduce((sum, factor) => sum + factor.impact, 0)

    // Ratio of net impact to total impact (0 to 1)
    const agreement = totalImpact > 0 ? Math.abs(netImpact) / totalImpact : 0

    // Base confidence (0.5 to 0.9) plus agreement factor
    return 0.5 + agreement * 0.4
  }
}

// Types
export interface PricingResult {
  basePrice: number
  suggestedPrice: number
  confidence: number
  factorBreakdown: FactorImpact[]
}

export interface FactorImpact {
  name: string
  impact: number
  percentage: number
}

export interface PriceHistoryPoint {
  price: number
  timestamp: string
}

export interface PricePrediction {
  currentPrice: number
  predictions: PricePredictionPoint[]
  confidence: number
}

export interface PricePredictionPoint {
  price: number
  date: string
  confidence: number
}

// Singleton instance
let pricingEngineInstance: PricingEngine | null = null

// Get the pricing engine instance
export function getPricingEngine(): PricingEngine {
  if (!pricingEngineInstance) {
    pricingEngineInstance = new PricingEngine()
  }
  return pricingEngineInstance
}

