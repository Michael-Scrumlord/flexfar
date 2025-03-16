// Repository Pattern implementation for Ticket data access
import {
  createTicketAdapter,
  type TicketProvider,
  type Ticket,
  type TicketData,
  type TicketFilters,
} from "../adapters/ticket-adapter"

// The Repository abstracts the data access logic and can work with multiple data sources
export class TicketRepository {
  private primaryProvider: TicketProvider
  private secondaryProviders: TicketProvider[] = []

  constructor(primarySource: string, config?: any) {
    this.primaryProvider = createTicketAdapter(primarySource, config)
  }

  // Add additional data sources
  addDataSource(source: string, config?: any): void {
    const provider = createTicketAdapter(source, config)
    this.secondaryProviders.push(provider)
  }

  // Get tickets from all sources
  async getAllTickets(filters?: TicketFilters): Promise<Ticket[]> {
    try {
      // First get tickets from primary source
      const primaryTickets = await this.primaryProvider.getTickets(filters)

      // Then get tickets from all secondary sources
      const secondaryTicketsPromises = this.secondaryProviders.map((provider) =>
        provider.getTickets(filters).catch((err) => {
          console.error(`Error fetching from secondary provider:`, err)
          return [] as Ticket[]
        }),
      )

      const secondaryTickets = await Promise.all(secondaryTicketsPromises)

      // Combine and deduplicate tickets
      const allTickets = [...primaryTickets, ...secondaryTickets.flat()]

      // Simple deduplication by ID
      const uniqueTickets = Array.from(new Map(allTickets.map((ticket) => [ticket.id, ticket])).values())

      return uniqueTickets
    } catch (error) {
      console.error("Error in getAllTickets:", error)
      throw error
    }
  }

  // Get a specific ticket by ID
  async getTicketById(ticketId: string): Promise<Ticket> {
    try {
      // Try to get from primary source first
      try {
        return await this.primaryProvider.getTicketById(ticketId)
      } catch (primaryError) {
        console.error("Primary source error, trying secondary sources:", primaryError)

        // If primary fails, try secondary sources
        for (const provider of this.secondaryProviders) {
          try {
            return await provider.getTicketById(ticketId)
          } catch (secondaryError) {
            // Continue to next provider
            console.error("Secondary source error:", secondaryError)
          }
        }

        // If all sources fail, throw error
        throw new Error(`Ticket with ID ${ticketId} not found in any data source`)
      }
    } catch (error) {
      console.error(`Error in getTicketById for ${ticketId}:`, error)
      throw error
    }
  }

  // Create a new ticket listing (only in primary source)
  async createTicket(ticketData: TicketData): Promise<Ticket> {
    try {
      return await this.primaryProvider.createTicketListing(ticketData)
    } catch (error) {
      console.error("Error in createTicket:", error)
      throw error
    }
  }

  // Update an existing ticket (only in primary source)
  async updateTicket(ticketId: string, updates: Partial<TicketData>): Promise<Ticket> {
    try {
      return await this.primaryProvider.updateTicketListing(ticketId, updates)
    } catch (error) {
      console.error(`Error in updateTicket for ${ticketId}:`, error)
      throw error
    }
  }

  // Delete a ticket listing (only in primary source)
  async deleteTicket(ticketId: string): Promise<boolean> {
    try {
      return await this.primaryProvider.deleteTicketListing(ticketId)
    } catch (error) {
      console.error(`Error in deleteTicket for ${ticketId}:`, error)
      throw error
    }
  }

  // Get tickets for a specific event
  async getTicketsByEvent(eventId: string, filters?: Omit<TicketFilters, "eventId">): Promise<Ticket[]> {
    return this.getAllTickets({ ...filters, eventId })
  }

  // Get tickets within a price range
  async getTicketsByPriceRange(
    minPrice: number,
    maxPrice: number,
    filters?: Omit<TicketFilters, "minPrice" | "maxPrice">,
  ): Promise<Ticket[]> {
    return this.getAllTickets({ ...filters, minPrice, maxPrice })
  }

  // Get tickets by seller
  async getTicketsBySeller(sellerId: string, filters?: Omit<TicketFilters, "sellerId">): Promise<Ticket[]> {
    return this.getAllTickets({ ...filters, sellerId })
  }
}

