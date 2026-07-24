// authController.js
import { publishEvent } from "../../../shared/messaging/publisher.js";
import { EXCHANGES, ROUTING_KEYS } from "../../../shared/messaging/constants.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { randomUUID } from "crypto";


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const correlationId =
      req.headers["x-correlation-id"] || randomUUID();

    await publishEvent({
      exchange: EXCHANGES.USER,
      routingKey: ROUTING_KEYS.USER_CREATED,

      correlationId,

      data: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      correlationId,
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
