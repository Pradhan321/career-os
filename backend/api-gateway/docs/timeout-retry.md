# Timeout & Retry

Gateway Timeout

- 10 seconds

Retry

Safe HTTP Methods

- GET
- HEAD
- OPTIONS

Unsafe methods (POST, PUT, PATCH, DELETE) are **not retried** to prevent duplicate operations.

If a downstream service exceeds the timeout, the gateway returns:

```json
{
  "success": false,
  "message": "Gateway Timeout"
}
```