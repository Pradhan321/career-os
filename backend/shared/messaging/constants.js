export const EXCHANGES = {
  USER: "user.exchange",
  RETRY: "retry.exchange",
  DLX: "deadletter.exchange",
};

export const ROUTING_KEYS = {
  USER_CREATED: "user.created",
  USER_CREATED_RETRY: "user.created.retry",
  USER_CREATED_FAILED: "user.created.failed",
};

export const QUEUES = {
  USER_CREATED: "user.created.queue",
  USER_CREATED_RETRY: "user.created.retry.queue",
  USER_CREATED_DLQ: "user.created.dlq",
};

export const RETRY = {
  MAX_RETRIES: 3,
  DELAY: 5000,
};