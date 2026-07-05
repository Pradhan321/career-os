# Rate Limiting

The API Gateway protects downstream services from excessive traffic.

Current Algorithm

- Fixed Window Counter

Current Limits

- General APIs: 100 requests / 15 minutes
- Authentication APIs: Configurable separately

Future Improvements

- Redis
- Token Bucket
- Distributed Rate Limiting