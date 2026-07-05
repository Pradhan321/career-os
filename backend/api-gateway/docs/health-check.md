# Health Check

Gateway Endpoint

```
GET /api/health
```

Example Response

```json
{
    "success": true,
    "gateway": "UP",
    "services": {
        "auth-service": "UP",
        "user-service": "UP"
    }
}
```

Purpose

- Kubernetes Readiness
- Monitoring
- Load Balancer Health Checks