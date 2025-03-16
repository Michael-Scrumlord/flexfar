// Fraud Detection Service
import { getEventBus, EventType } from "./event-bus"

export interface FraudRule {
  name: string
  weight: number
  evaluate: (transaction: Transaction, context: FraudContext) => number
}

export interface Transaction {
  id: string
  userId: string
  ticketId: string
  amount: number
  paymentMethod: string
  timestamp: string
  ipAddress?: string
  deviceId?: string
  metadata?: Record<string, any>
}

export interface FraudContext {
  userHistory?: UserHistory
  ticketData?: any
  marketData?: any
}

export interface UserHistory {
  userId: string
  accountAge: number // in days
  previousTransactions: number
  averageTransactionAmount: number
  lastLoginTimestamp?: string
  lastLoginIpAddress?: string
  lastLoginDeviceId?: string
}

export class FraudDetectionService {
  private rules: FraudRule[] = []
  private eventBus = getEventBus()
  private riskThreshold = 70 // Score above this is considered high risk

  constructor() {
    this.registerDefaultRules()
    this.subscribeToEvents()
  }

  // Register a new fraud detection rule
  public registerRule(rule: FraudRule): void {
    this.rules.push(rule)
    console.log(`Registered fraud rule: ${rule.name} with weight ${rule.weight}`)
  }

  // Evaluate a transaction for fraud risk
  public async evaluateTransaction(transaction: Transaction): Promise<FraudResult> {
    try {
      console.log(`Evaluating transaction for fraud: ${JSON.stringify(transaction)}`)

      // Fetch context data
      const context = await this.fetchFraudContext(transaction)

      // Apply each rule
      let totalScore = 0
      let totalWeight = 0
      const ruleResults: RuleResult[] = []

      for (const rule of this.rules) {
        const ruleScore = rule.evaluate(transaction, context)
        const weightedScore = ruleScore * rule.weight

        totalScore += weightedScore
        totalWeight += rule.weight

        ruleResults.push({
          ruleName: rule.name,
          score: ruleScore,
          weightedScore,
        })
      }

      // Normalize score to 0-100
      const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0

      // Determine risk level
      const riskLevel = this.determineRiskLevel(normalizedScore)

      // Determine if transaction should be approved
      const approved = riskLevel !== "high"

      const result: FraudResult = {
        transactionId: transaction.id,
        score: normalizedScore,
        riskLevel,
        approved,
        reviewRequired: riskLevel === "medium",
        ruleResults,
      }

      console.log(`Fraud evaluation result: ${JSON.stringify(result)}`)

      // If high risk, publish fraud detected event
      if (riskLevel === "high") {
        this.eventBus.publish(EventType.FRAUD_DETECTED, {
          transaction,
          fraudResult: result,
          timestamp: new Date().toISOString(),
        })
      }

      return result
    } catch (error) {
      console.error("Error evaluating transaction for fraud:", error)
      throw error
    }
  }

  // Set the risk threshold
  public setRiskThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new Error("Risk threshold must be between 0 and 100")
    }
    this.riskThreshold = threshold
    console.log(`Risk threshold set to ${threshold}`)
  }

  // Private methods
  private registerDefaultRules(): void {
    // New user rule
    this.registerRule({
      name: "New User",
      weight: 0.15,
      evaluate: (transaction, context) => {
        if (!context.userHistory) {
          return 1.0 // Very new user, high risk
        }

        const accountAgeDays = context.userHistory.accountAge
        if (accountAgeDays < 1) {
          return 1.0 // Account created today
        } else if (accountAgeDays < 7) {
          return 0.7 // Account less than a week old
        } else if (accountAgeDays < 30) {
          return 0.3 // Account less than a month old
        } else {
          return 0.0 // Established account
        }
      },
    })

    // Transaction amount rule
    this.registerRule({
      name: "Transaction Amount",
      weight: 0.2,
      evaluate: (transaction, context) => {
        const amount = transaction.amount

        // Check if amount is unusually high
        if (amount > 5000) {
          return 0.9 // Very high amount
        } else if (amount > 2000) {
          return 0.6 // High amount
        } else if (amount > 1000) {
          return 0.3 // Moderate amount
        } else {
          return 0.0 // Normal amount
        }
      },
    })

    // Transaction velocity rule
    this.registerRule({
      name: "Transaction Velocity",
      weight: 0.25,
      evaluate: (transaction, context) => {
        if (!context.userHistory) {
          return 0.5 // No history, moderate risk
        }

        // Check recent transactions (would be implemented in a real system)
        // For now, use a placeholder implementation
        const recentTransactions = 0 // This would be fetched from a database

        if (recentTransactions > 10) {
          return 0.9 // Many recent transactions
        } else if (recentTransactions > 5) {
          return 0.5 // Several recent transactions
        } else {
          return 0.0 // Few or no recent transactions
        }
      },
    })

    // IP address change rule
    this.registerRule({
      name: "IP Address Change",
      weight: 0.15,
      evaluate: (transaction, context) => {
        if (!context.userHistory || !context.userHistory.lastLoginIpAddress || !transaction.ipAddress) {
          return 0.3 // No history or missing data, slight risk
        }

        // Check if IP address is different from last login
        const ipChanged = context.userHistory.lastLoginIpAddress !== transaction.ipAddress
        return ipChanged ? 0.7 : 0.0
      },
    })

    // Device change rule
    this.registerRule({
      name: "Device Change",
      weight: 0.15,
      evaluate: (transaction, context) => {
        if (!context.userHistory || !context.userHistory.lastLoginDeviceId || !transaction.deviceId) {
          return 0.3 // No history or missing data, slight risk
        }

        // Check if device is different from last login
        const deviceChanged = context.userHistory.lastLoginDeviceId !== transaction.deviceId
        return deviceChanged ? 0.7 : 0.0
      },
    })

    // Payment method risk rule
    this.registerRule({
      name: "Payment Method Risk",
      weight: 0.1,
      evaluate: (transaction, context) => {
        // Different payment methods have different risk profiles
        switch (transaction.paymentMethod) {
          case "credit_card":
            return 0.3 // Moderate risk
          case "paypal":
            return 0.2 // Lower risk
          case "bank_transfer":
            return 0.1 // Low risk
          case "crypto":
            return 0.8 // High risk
          default:
            return 0.5 // Unknown method, moderate risk
        }
      },
    })
  }

  private subscribeToEvents(): void {
    // Listen for payment events to evaluate for fraud
    this.eventBus.subscribe(EventType.PAYMENT_COMPLETED, async (data) => {
      try {
        // Convert payment data to transaction format
        const transaction: Transaction = {
          id: data.paymentId,
          userId: data.userId,
          ticketId: data.ticketId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp,
          ipAddress: data.ipAddress,
          deviceId: data.deviceId,
          metadata: data.metadata,
        }

        // Evaluate for fraud
        await this.evaluateTransaction(transaction)
      } catch (error) {
        console.error("Error handling payment completed event:", error)
      }
    })
  }

  private async fetchFraudContext(transaction: Transaction): Promise<FraudContext> {
    try {
      // In a real implementation, this would fetch real context data
      const context: FraudContext = {}

      // Fetch user history
      try {
        const userResponse = await fetch(`/api/users/${transaction.userId}/history`)
        if (userResponse.ok) {
          context.userHistory = await userResponse.json()
        }
      } catch (error) {
        console.error(`Error fetching user history for ${transaction.userId}:`, error)
      }

      // Fetch ticket data
      try {
        const ticketResponse = await fetch(`/api/tickets/${transaction.ticketId}`)
        if (ticketResponse.ok) {
          context.ticketData = await ticketResponse.json()
        }
      } catch (error) {
        console.error(`Error fetching ticket data for ${transaction.ticketId}:`, error)
      }

      // Fetch market data
      if (context.ticketData?.eventId) {
        try {
          const marketResponse = await fetch(`/api/market-data?eventId=${context.ticketData.eventId}`)
          if (marketResponse.ok) {
            context.marketData = await marketResponse.json()
          }
        } catch (error) {
          console.error(`Error fetching market data for event ${context.ticketData.eventId}:`, error)
        }
      }

      return context
    } catch (error) {
      console.error("Error fetching fraud context:", error)
      return {}
    }
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= this.riskThreshold) {
      return "high"
    } else if (score >= this.riskThreshold * 0.7) {
      return "medium"
    } else {
      return "low"
    }
  }
}

// Types
export type RiskLevel = "low" | "medium" | "high"

export interface FraudResult {
  transactionId: string
  score: number
  riskLevel: RiskLevel
  approved: boolean
  reviewRequired: boolean
  ruleResults: RuleResult[]
}

export interface RuleResult {
  ruleName: string
  score: number
  weightedScore: number
}

// Singleton instance
let fraudDetectionInstance: FraudDetectionService | null = null

// Get the fraud detection service instance
export function getFraudDetectionService(): FraudDetectionService {
  if (!fraudDetectionInstance) {
    fraudDetectionInstance = new FraudDetectionService()
  }
  return fraudDetectionInstance
}

