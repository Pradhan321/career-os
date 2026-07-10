import { consumeEvent } from "../../../shared/messaging/consumer.js";

import {
  EXCHANGES,
  QUEUES,
  ROUTING_KEYS,
} from "../../../shared/messaging/constants.js";

import {
  handleUserCreated,
} from "../consumers/user.consumer.js";

export const startConsumers = async () => {

  await consumeEvent({
    exchange: EXCHANGES.USER,
    queue: QUEUES.USER_CREATED,
    routingKey: ROUTING_KEYS.USER_CREATED,
    handler: handleUserCreated,
  });

};