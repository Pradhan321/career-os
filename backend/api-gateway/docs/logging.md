# Structured Logging

Every request is logged in JSON format.

Example

```json
{
  "timestamp": "...",
  "requestId": "...",
  "method": "POST",
  "url": "/api/auth/register",
  "status": 201,
  "responseTime": "182 ms",
  "ip": "::1"
}
```

Benefits

- Easier debugging
- Distributed tracing
- Production monitoring
- Log aggregation