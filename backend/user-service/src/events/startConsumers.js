import { getChannel } from "../../../shared/messaging/rabbitmq.js";
import { setupTopology } from "../../../shared/messaging/topology.js";
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

  const channel = getChannel();

  // Create exchanges, queues and bindings
  await setupTopology(channel);

  // Start listening
  await consumeEvent({
    exchange: EXCHANGES.USER,
    queue: QUEUES.USER_CREATED,
    routingKey: ROUTING_KEYS.USER_CREATED,
    handler: handleUserCreated,
  });

};