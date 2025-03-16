// Event Bus for Event-Driven Architecture

type EventCallback = (data: any) => void

export class EventBus {
  private static instance: EventBus
  private subscribers: Map<string, EventCallback[]> = new Map()

  // Singleton pattern
  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  // Subscribe to an event
  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }

    this.subscribers.get(event)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index !== -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // Publish an event
  public publish(event: string, data: any): void {
    if (!this.subscribers.has(event)) {
      return
    }

    const callbacks = this.subscribers.get(event)!
    callbacks.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error)
      }
    })
  }

  // Check if an event has subscribers
  public hasSubscribers(event: string): boolean {
    return this.subscribers.has(event) && this.subscribers.get(event)!.length > 0
  }

  // Get subscriber count for an event
  public subscriberCount(event: string): number {
    if (!this.subscribers.has(event)) {
      return 0
    }
    return this.subscribers.get(event)!.length
  }

  // Clear all subscribers for an event
  public clearEvent(event: string): void {
    this.subscribers.delete(event)
  }

  // Clear all subscribers
  public clearAll(): void {
    this.subscribers.clear()
  }
}

// Event types
export enum EventType {
  TICKET_CREATED = "ticket.created",
  TICKET_UPDATED = "ticket.updated",
  TICKET_DELETED = "ticket.deleted",
  TICKET_SOLD = "ticket.sold",
  PRICE_CHANGED = "price.changed",
  PAYMENT_COMPLETED = "payment.completed",
  PAYMENT_FAILED = "payment.failed",
  USER_REGISTERED = "user.registered",
  USER_LOGGED_IN = "user.logged_in",
  FRAUD_DETECTED = "fraud.detected",
}

// Helper function to get the event bus instance
export function getEventBus(): EventBus {
  return EventBus.getInstance()
}

