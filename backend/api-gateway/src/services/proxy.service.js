import axios from "axios";

import { retry } from "../utils/retry.js";

import { GATEWAY } from "../config/constants.js";

const SAFE_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS"
];

export const proxyRequest = async ({
  method,
  url,
  headers,
  body,
  query,
  requestId,
}) => {

  const operation = () =>
    axios({
      method,
      url,
      headers: {
        ...headers,
        "X-Request-Id": requestId,
      },
      data: body,
      params: query,
      timeout: GATEWAY.REQUEST_TIMEOUT,
      validateStatus: () => true,
    });

  if (SAFE_METHODS.includes(method.toUpperCase())) {
    return retry(
      operation,
      GATEWAY.RETRY_ATTEMPTS,
      GATEWAY.RETRY_DELAY
    );
  }

  return operation();
};