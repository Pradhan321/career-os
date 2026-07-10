# Day 3 Notes – API Gateway (Production Infrastructure)

## 📅 Date
> _(Fill the date when you complete this day.)_

---

# 🎯 Goal

Today I transformed my API Gateway from a simple reverse proxy into a production-inspired gateway by implementing infrastructure features that are commonly used in modern microservice architectures.

---

# Topics Covered

- Dynamic API Gateway
- Service Registry
- Request Correlation ID
- Structured Logging
- Gateway Timeout
- Retry Mechanism
- Health Check Aggregation
- Rate Limiting
- Express 5 Wildcard Routing
- Gateway Documentation

---

# 1. Dynamic API Gateway

## What I Learned

Initially, the gateway contained separate controllers for every service.

Example:

```text
authProxy()

profileProxy()

resumeProxy()
```

This approach doesn't scale because every new microservice requires additional controller logic.

Instead, I built a dynamic gateway that forwards requests based on a Service Registry.

Example:

```
Client

↓

Gateway

↓

Extract Service Name

↓

Look inside Service Registry

↓

Forward Request
```

Now adding a new service only requires updating the Service Registry.

---

# Service Registry

```javascript
export const SERVICES = {

    auth: {
        baseURL: "...",
        prefix: "/api/v1/auth"
    },

    profiles: {
        baseURL: "...",
        prefix: "/api/v1/profiles"
    }

};
```

Advantages

- Easy to maintain
- Easy to scale
- No duplicate proxy controllers

---

# 2. Reverse Proxy

The gateway receives every client request and forwards it to the appropriate microservice.

Responsibilities:

- Forward HTTP Method
- Forward Headers
- Forward JWT
- Forward Query Parameters
- Forward Request Body

Implemented using Axios.

---

# 3. Request Correlation ID

## What is it?

A unique ID generated for every request entering the Gateway.

Example

```
Request

↓

Gateway

↓

Generate UUID

↓

Attach Request ID

↓

Forward to Microservices
```

Every downstream service receives the same Request ID.

Benefits

- Easier debugging
- Distributed tracing
- Production monitoring
- Track one request across multiple services

---

# Middleware

```javascript
req.requestId = uuid();
```

Response Header

```
X-Request-Id
```

---

# 4. Structured Logging

Instead of

```
User Created
```

I implemented JSON logs.

Example

```json
{
    "timestamp":"...",
    "requestId":"...",
    "method":"POST",
    "url":"/api/auth/register",
    "status":201,
    "responseTime":"182 ms",
    "ip":"::1"
}
```

Benefits

- Machine readable
- Easier debugging
- Compatible with ELK Stack
- Compatible with Grafana
- Compatible with Datadog

---

# Why use res.on("finish")?

Logging after the response is sent allows me to capture

- Status Code
- Response Time
- Final Request Result

instead of logging before the request finishes.

---

# 5. Gateway Timeout

Problem

A microservice may become slow or unavailable.

Without timeout

```
Gateway

↓

Wait forever
```

With timeout

```
Gateway

↓

10 Seconds

↓

504 Gateway Timeout
```

Current Timeout

```
10 Seconds
```

---

# 6. Retry Mechanism

Implemented retry logic for temporary failures.

Current Configuration

```javascript
REQUEST_TIMEOUT = 10000

RETRY_ATTEMPTS = 2

RETRY_DELAY = 1000
```

---

# Safe HTTP Methods

Retries are allowed only for

- GET
- HEAD
- OPTIONS

Unsafe methods are NOT retried.

- POST
- PUT
- PATCH
- DELETE

Reason

Retrying unsafe requests may create duplicate resources.

Example

```
POST /register

↓

User Created

↓

Network Error

↓

Retry

↓

Duplicate User
```

---

# 7. Health Check Aggregation

Gateway exposes

```
GET /api/health
```

Gateway internally checks

- Auth Service
- User Service

Example Response

```json
{
    "gateway":"UP",
    "services":{
        "auth-service":"UP",
        "user-service":"UP"
    }
}
```

Implemented using

```
Promise.all()
```

Advantages

- Faster execution
- Parallel requests
- Production standard

---

# 8. Rate Limiting

Purpose

Protect downstream services from

- Brute Force Attacks
- DDoS
- API Abuse

Current Algorithm

```
Fixed Window Counter
```

Current Configuration

```
100 Requests

↓

15 Minutes

↓

Per IP
```

Implemented using

```
express-rate-limit
```

Future Improvement

Redis-based Distributed Rate Limiting

---

# 9. Express 5 Wildcard Routing

One important issue encountered today.

Route

```javascript
router.all("/:service/{*path}", gatewayProxy);
```

Unexpected Behavior

```
req.params.path
```

returned

```javascript
[
    "search",
    "skills"
]
```

instead of

```
"search/skills"
```

This generated an incorrect URL

```
search,skills
```

instead of

```
search/skills
```

Solution

```javascript
const path = Array.isArray(req.params.path)
    ? req.params.path.join("/")
    : req.params.path || "";
```

Lesson

Express 5 wildcard parameters return an array and need normalization before constructing URLs.

---

# 10. Gateway Documentation

Created

```
README.md
```

Created docs

```
architecture.md

api-endpoints.md

request-flow.md

logging.md

health-check.md

rate-limiting.md

timeout-retry.md
```

This documentation explains

- Architecture
- Gateway Features
- Request Flow
- Logging
- APIs
- Infrastructure Components

---

# Folder Structure

```
api-gateway

src

├── config
├── controllers
├── middlewares
├── routes
├── services
├── utils

docs

README.md
```

---

# Interview Questions I Can Answer

### What is an API Gateway?

A single entry point that routes client requests to the appropriate microservice while handling cross-cutting concerns such as authentication forwarding, logging, rate limiting, request tracing, and health monitoring.

---

### What is a Service Registry?

A centralized configuration that maps service names to their base URLs and route prefixes, allowing the gateway to route requests dynamically.

---

### What is a Correlation ID?

A unique identifier generated by the gateway and propagated across services to trace a request through a distributed system.

---

### Why use Structured Logging?

Structured logs are machine-readable and integrate well with monitoring and log aggregation tools, making debugging and analysis much easier.

---

### Why implement Gateway Timeouts?

To prevent the gateway from waiting indefinitely for slow or unresponsive downstream services, protecting system resources and improving user experience.

---

### Why retry only GET requests?

GET, HEAD, and OPTIONS are safe and idempotent. Retrying POST, PUT, PATCH, or DELETE can cause duplicate operations or inconsistent data.

---

### Why use Promise.all() in Health Checks?

It performs independent service health checks concurrently, reducing the total response time.

---

### Why implement Rate Limiting at the Gateway?

Because the gateway is the first entry point. Rejecting excessive requests there protects all downstream services from unnecessary load.

---

# Today's Biggest Learning

Today I moved beyond CRUD development and implemented infrastructure components that are commonly found in production API Gateways.

These include:

- Dynamic Routing
- Request Tracing
- Structured Logging
- Health Monitoring
- Retry Policies
- Gateway Timeouts
- Rate Limiting

These features make the system more scalable, maintainable, and production-ready.

---

# Next Goal

Implement Event-Driven Architecture using RabbitMQ.

Upcoming Topics

- RabbitMQ
- Producers
- Consumers
- Exchanges
- Queues
- Routing Keys
- Event Publishing
- Event Consumption
- Automatic Profile Creation
- Asynchronous Microservice Communication
- Dead Letter Queues (DLQ)
- Message Acknowledgements