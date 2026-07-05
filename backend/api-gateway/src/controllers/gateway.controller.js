import { SERVICES } from "../config/services.js";
import { proxyRequest } from "../services/proxy.service.js";

export const gatewayProxy = async (req, res, next) => {
  try {
    const service = req.params.service;

    const config = SERVICES[service];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Unknown Service",
      });
    }

    const path = Array.isArray(req.params.path)
  ? req.params.path.join("/")
  : req.params.path || "";
    
    const url = config.baseURL + config.prefix + (path ? `/${path}` : "");
    
    const response = await proxyRequest({
      method: req.method,
      url,
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
      body: req.body,
      query: req.query,
      requestId: req.requestId,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "Gateway Timeout",
      });
    }

    next(error);
  }
};
