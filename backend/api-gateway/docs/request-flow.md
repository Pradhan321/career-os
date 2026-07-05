# Request Flow

```
Client

↓

API Gateway

↓

Request ID Generated

↓

Logger Starts

↓

Rate Limiter

↓

Service Registry

↓

Proxy Request

↓

Microservice

↓

Response

↓

Gateway

↓

Logger Ends
```

Every request receives a unique Request ID which is forwarded to downstream services.