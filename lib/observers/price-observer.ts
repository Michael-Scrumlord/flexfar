// Observer Pattern implementation for price notifications

// Subject interface
export interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(data: any): void
}

// Observer interface
export interface Observer {
  update(subject: Subject, data: any): void
}

// Concrete Subject for price changes
export class PriceChangeSubject implements Subject {
  private observers: Observer[] = []
  private state: any = {}

  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return console.log("Observer has been attached already.")
    }

    console.log("Observer attached")
    this.observers.push(observer)
  }

  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log("Nonexistent observer.")
    }

    this.observers.splice(observerIndex, 1)
    console.log("Observer detached")
  }

  notify(data: any): void {
    console.log("Notifying observers...")
    for (const observer of this.observers) {
      observer.update(this, data)
    }
  }

  // Business logic for price change detection
  setPriceChange(ticketId: string, oldPrice: number, newPrice: number): void {
    this.state = {
      ticketId,
      oldPrice,
      newPrice,
      percentChange: ((newPrice - oldPrice) / oldPrice) * 100,
      timestamp: new Date().toISOString(),
    }

    console.log(`Price change detected for ticket ${ticketId}: ${oldPrice} -> ${newPrice}`)
    this.notify(this.state)
  }
}

// Concrete Observer for email notifications
export class EmailNotificationObserver implements Observer {
  private userId: string
  private email: string
  private threshold: number

  constructor(userId: string, email: string, threshold = 5) {
    this.userId = userId
    this.email = email
    this.threshold = threshold // Percentage threshold for notifications
  }

  update(subject: Subject, data: any): void {
    // Only notify if the price change exceeds the threshold
    if (Math.abs(data.percentChange) >= this.threshold) {
      console.log(`Sending email to ${this.email} about price change: ${data.percentChange.toFixed(2)}%`)

      // In a real implementation, this would send an actual email
      this.sendEmail({
        to: this.email,
        subject: `Price Alert: ${data.percentChange > 0 ? "Increase" : "Decrease"} for Ticket ${data.ticketId}`,
        body: `The price for ticket ${data.ticketId} has ${data.percentChange > 0 ? "increased" : "decreased"} by ${Math.abs(data.percentChange).toFixed(2)}%. 
               Old price: $${data.oldPrice.toFixed(2)}
               New price: $${data.newPrice.toFixed(2)}`,
      })
    }
  }

  private sendEmail(emailData: { to: string; subject: string; body: string }): void {
    // Mock implementation - in a real app, this would use an email service
    console.log("Email sent:", emailData)

    // Record notification in database
    fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        type: "price_alert",
        channel: "email",
        message: emailData.body,
        metadata: {
          emailTo: emailData.to,
          emailSubject: emailData.subject,
        },
      }),
    }).catch((error) => {
      console.error("Failed to record notification:", error)
    })
  }
}

// Concrete Observer for in-app notifications
export class InAppNotificationObserver implements Observer {
  private userId: string
  private threshold: number

  constructor(userId: string, threshold = 0) {
    this.userId = userId
    this.threshold = threshold // Percentage threshold for notifications (0 means notify on any change)
  }

  update(subject: Subject, data: any): void {
    // Only notify if the price change exceeds the threshold
    if (Math.abs(data.percentChange) >= this.threshold) {
      console.log(
        `Sending in-app notification to user ${this.userId} about price change: ${data.percentChange.toFixed(2)}%`,
      )

      // In a real implementation, this would send to a notification service
      this.sendNotification({
        userId: this.userId,
        title: `Price ${data.percentChange > 0 ? "Increase" : "Decrease"} Alert`,
        message: `The price for ticket ${data.ticketId} has ${data.percentChange > 0 ? "increased" : "decreased"} by ${Math.abs(data.percentChange).toFixed(2)}%.`,
        data: {
          ticketId: data.ticketId,
          oldPrice: data.oldPrice,
          newPrice: data.newPrice,
          percentChange: data.percentChange,
        },
      })
    }
  }

  private sendNotification(notificationData: { userId: string; title: string; message: string; data: any }): void {
    // Mock implementation - in a real app, this would use a notification service
    console.log("In-app notification sent:", notificationData)

    // Record notification in database
    fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.userId,
        type: "price_alert",
        channel: "in_app",
        title: notificationData.title,
        message: notificationData.message,
        metadata: notificationData.data,
      }),
    }).catch((error) => {
      console.error("Failed to record notification:", error)
    })
  }
}

// Factory function to create price observers
export function createPriceObserver(type: string, userId: string, config: any): Observer {
  switch (type.toLowerCase()) {
    case "email":
      return new EmailNotificationObserver(userId, config.email, config.threshold)
    case "in_app":
      return new InAppNotificationObserver(userId, config.threshold)
    default:
      throw new Error(`Unsupported observer type: ${type}`)
  }
}

