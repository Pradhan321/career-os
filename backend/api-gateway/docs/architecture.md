# Architecture

```
                 Client
                    │
                    ▼
            API Gateway
                    │
     ┌──────────────┴──────────────┐
     ▼                             ▼
Auth Service                 User Service
```

The API Gateway acts as the single entry point for all incoming requests.

Responsibilities:

- Reverse Proxy
- Routing
- Authentication Forwarding
- Logging
- Request Tracing
- Rate Limiting
- Health Monitoring
- Timeout Handling