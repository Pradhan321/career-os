# 🚀 CareerOS API Gateway

A production-inspired API Gateway built with **Node.js**, **Express 5**, and **Axios** as part of the CareerOS Microservices Architecture.

The gateway acts as the single entry point for all client requests and forwards them to the appropriate microservice while handling authentication, logging, request tracing, rate limiting, health monitoring, and timeout management.

---

# Features

- Dynamic Service Routing
- Reverse Proxy
- Service Registry
- Request Correlation ID
- Structured Logging
- Rate Limiting
- Request Timeout
- Retry Mechanism for Safe HTTP Methods
- Health Check Aggregation
- JWT Forwarding
- Express 5 Compatible Routing

---

# Tech Stack

- Node.js
- Express 5
- Axios
- UUID
- Express Rate Limit
- Helmet
- Morgan
- CORS

---

# Project Structure

```
src/
│
├── config/
│      constants.js
│      env.js
│      services.js
│
├── controllers/
│      gateway.controller.js
│      health.controller.js
│
├── middlewares/
│      logger.middleware.js
│      requestId.middleware.js
│      rateLimiter.middleware.js
│
├── routes/
│      gateway.routes.js
│
├── services/
│      proxy.service.js
│
├── utils/
│      asyncHandler.js
│      logger.js
│      retry.js
│
├── app.js
└── server.js
```

---

# Supported Services

| Service | Route |
|----------|-------|
| Auth Service | /api/auth |
| User Service | /api/profiles |

---

# Documentation

Detailed documentation is available inside the **docs/** folder.

- Architecture
- API Endpoints
- Request Flow
- Logging
- Health Check
- Timeout & Retry
- Rate Limiting

---

# Future Improvements

- RabbitMQ Integration
- Redis Rate Limiting
- Circuit Breaker
- Service Discovery
- Docker
- Kubernetes
- OpenTelemetry
- Prometheus & Grafana