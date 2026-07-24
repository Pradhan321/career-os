import {
  EXCHANGES,
  QUEUES,
  ROUTING_KEYS,
  RETRY,
} from "./constants.js";

export const setupTopology = async (channel) => {

  // =========================
  // Exchanges
  // =========================

  await channel.assertExchange(
    EXCHANGES.USER,
    "direct",
    { durable: true }
  );

  await channel.assertExchange(
    EXCHANGES.RETRY,
    "direct",
    { durable: true }
  );

  await channel.assertExchange(
    EXCHANGES.DLX,
    "direct",
    { durable: true }
  );

  // =========================
  // Main Queue
  // =========================

  await channel.assertQueue(
    QUEUES.USER_CREATED,
    {
      durable: true,

      deadLetterExchange: EXCHANGES.RETRY,

      deadLetterRoutingKey:
        ROUTING_KEYS.USER_CREATED_RETRY,
    }
  );

  // =========================
  // Retry Queue
  // =========================

  await channel.assertQueue(
    QUEUES.USER_CREATED_RETRY,
    {
      durable: true,

      messageTtl: RETRY.DELAY,

      deadLetterExchange:
        EXCHANGES.USER,

      deadLetterRoutingKey:
        ROUTING_KEYS.USER_CREATED,
    }
  );

  // =========================
  // DLQ
  // =========================

  await channel.assertQueue(
    QUEUES.USER_CREATED_DLQ,
    {
      durable: true,
    }
  );

  // =========================
  // Bindings
  // =========================

  await channel.bindQueue(
    QUEUES.USER_CREATED,
    EXCHANGES.USER,
    ROUTING_KEYS.USER_CREATED
  );

  await channel.bindQueue(
    QUEUES.USER_CREATED_RETRY,
    EXCHANGES.RETRY,
    ROUTING_KEYS.USER_CREATED_RETRY
  );

  await channel.bindQueue(
    QUEUES.USER_CREATED_DLQ,
    EXCHANGES.DLX,
    ROUTING_KEYS.USER_CREATED_FAILED
  );

  console.log(
    "✅ RabbitMQ Topology Ready"
  );
};