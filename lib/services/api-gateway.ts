// API Gateway Pattern implementation
import { type NextRequest, NextResponse } from "next/server"

// Interface for middleware handlers
export interface MiddlewareHandler {
  handle(req: NextRequest, context: RequestContext): Promise<NextResponse | null>
}

// Context passed between middleware handlers
export interface RequestContext {
  userId?: string
  isAuthenticated: boolean
  roles: string[]
  params: Record<string, string>
  startTime: number
  [key: string]: any
}

// API Gateway class
export class ApiGateway {
  private middlewares: MiddlewareHandler[] = []
  private routeHandlers: Map<string, RouteHandler> = new Map()

  // Add middleware to the pipeline
  public use(middleware: MiddlewareHandler): void {
    this.middlewares.push(middleware)
  }

  // Register a route handler
  public registerRoute(path: string, method: HttpMethod, handler: RouteHandler): void {
    const key = `${method}:${path}`
    this.routeHandlers.set(key, handler)
  }

  // Process a request through the gateway
  public async processRequest(req: NextRequest): Promise<NextResponse> {
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method as HttpMethod
    const key = `${method}:${path}`

    // Create initial context
    const context: RequestContext = {
      isAuthenticated: false,
      roles: [],
      params: {},
      startTime: Date.now(),
    }

    // Run through middleware pipeline
    for (const middleware of this.middlewares) {
      try {
        const response = await middleware.handle(req, context)
        if (response) {
          // Middleware short-circuited the pipeline
          return response
        }
      } catch (error) {
        console.error("Middleware error:", error)
        return NextResponse.json({ error: "Internal server error in middleware" }, { status: 500 })
      }
    }

    // Find route handler
    const handler = this.routeHandlers.get(key)
    if (!handler) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Execute route handler
    try {
      return await handler(req, context)
    } catch (error) {
      console.error("Route handler error:", error)
      return NextResponse.json({ error: "Internal server error in route handler" }, { status: 500 })
    }
  }
}

// Types
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type RouteHandler = (req: NextRequest, context: RequestContext) => Promise<NextResponse>

// Middleware implementations

// Authentication middleware
export class AuthMiddleware implements MiddlewareHandler {
  async handle(req: NextRequest, context: RequestContext): Promise<NextResponse | null> {
    // Get auth token from header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token, continue pipeline but user is not authenticated
      return null
    }

    const token = authHeader.substring(7)

    try {
      // In a real implementation, this would verify the JWT token
      // For now, we'll use a simple mock implementation
      if (token === "invalid") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Mock user data
      context.userId = "user123"
      context.isAuthenticated = true
      context.roles = ["user"]

      // Continue pipeline
      return null
    } catch (error) {
      console.error("Auth error:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

// Rate limiting middleware
export class RateLimitMiddleware implements MiddlewareHandler {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map()
  private limit: number
  private windowMs: number

  constructor(limit = 100, windowMs = 60000) {
    this.limit = limit
    this.windowMs = windowMs
  }

  async handle(req: NextRequest, context: RequestContext): Promise<NextResponse | null> {
    // Get client IP
    const ip = req.headers.get("x-forwarded-for") || "unknown"

    // Get current time
    const now = Date.now()

    // Get or create rate limit entry
    let entry = this.requestCounts.get(ip)
    if (!entry || entry.resetTime < now) {
      entry = { count: 0, resetTime: now + this.windowMs }
      this.requestCounts.set(ip, entry)
    }

    // Increment count
    entry.count++

    // Check if over limit
    if (entry.count > this.limit) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": this.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(entry.resetTime / 1000).toString(),
          },
        },
      )
    }

    // Continue pipeline
    return null
  }
}

// Logging middleware
export class LoggingMiddleware implements MiddlewareHandler {
  async handle(req: NextRequest, context: RequestContext): Promise<NextResponse | null> {
    const url = new URL(req.url)
    const method = req.method
    const path = url.pathname

    // Log request
    console.log(`[${new Date().toISOString()}] ${method} ${path}`)

    // Add request to context for later logging
    context.requestMethod = method
    context.requestPath = path

    // Continue pipeline
    return null
  }
}

// CORS middleware
export class CorsMiddleware implements MiddlewareHandler {
  private allowedOrigins: string[]

  constructor(allowedOrigins: string[] = ["*"]) {
    this.allowedOrigins = allowedOrigins
  }

  async handle(req: NextRequest, context: RequestContext): Promise<NextResponse | null> {
    const origin = req.headers.get("origin") || ""

    // Check if origin is allowed
    const isAllowed = this.allowedOrigins.includes("*") || this.allowedOrigins.includes(origin)

    if (req.method === "OPTIONS") {
      // Handle preflight request
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": isAllowed ? origin : "",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      })
    }

    // For actual request, continue pipeline but set CORS headers
    context.corsHeaders = {
      "Access-Control-Allow-Origin": isAllowed ? origin : "",
    }

    return null
  }
}

// Create and configure API Gateway
export function createApiGateway(): ApiGateway {
  const gateway = new ApiGateway()

  // Add middleware
  gateway.use(new LoggingMiddleware())
  gateway.use(new CorsMiddleware())
  gateway.use(new RateLimitMiddleware())
  gateway.use(new AuthMiddleware())

  return gateway
}

