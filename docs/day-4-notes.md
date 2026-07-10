# 📅 Day 4 Notes — Event-Driven Architecture with RabbitMQ

## Project
CareerOS - Production Ready Microservices

---

# 🎯 Goal

Today's goal was to remove direct communication between microservices and replace it with asynchronous messaging using RabbitMQ.

Previously:

Client
→ API Gateway
→ Auth Service
→ HTTP Request
→ User Service

Now:

Client
→ API Gateway
→ Auth Service
→ RabbitMQ
→ User Service

This makes the architecture loosely coupled and event-driven.

---

# Why RabbitMQ?

In a traditional microservice architecture, services communicate using HTTP.

Example:

Auth Service

↓

POST /profiles

↓

User Service

Problems:

- Tight coupling
- User Service must always be online
- Failures propagate across services
- Difficult to scale
- Hard to add new consumers

RabbitMQ solves these problems.

Instead of calling another service directly, a service publishes an event.

Any interested service can consume that event independently.

---

# Event Driven Architecture

Instead of asking another service to do work,

we announce that something happened.

Example:

User Registered

↓

Publish Event

↓

RabbitMQ

↓

User Service

↓

Create Profile

This is called Event Driven Architecture (EDA).

---

# RabbitMQ Concepts Learned

## Producer

A service that publishes messages.

Example:

Auth Service

---

## Consumer

A service that listens to messages.

Example:

User Service

---

## Exchange

Receives messages from producers.

Routes messages to queues.

Today we used:

Direct Exchange

Name:

user.exchange

---

## Queue

Stores messages until consumers process them.

Queue created:

user.created.queue

---

## Routing Key

A label used by RabbitMQ to decide where a message goes.

Today's routing key:

user.created

---

## Channel

Applications never publish directly through a connection.

Connection

↓

Channel

↓

Publish

Channels are lightweight.

Connections are expensive.

---

## Connection

Long-lived TCP connection to RabbitMQ.

One application should create a connection only once.

---

# RabbitMQ Flow

Auth Service

↓

Publish user.created

↓

RabbitMQ Exchange

↓

user.created.queue

↓

User Service

↓

Create Profile

---

# Why Event Driven?

Old Flow

Register User

↓

Create Profile using HTTP

↓

If User Service is down

↓

Registration fails

New Flow

Register User

↓

Publish Event

↓

RabbitMQ stores message

↓

User Service processes later

Registration no longer depends on User Service.

---

# Folder Structure

backend/

shared/

messaging/

constants.js

rabbitmq.js

publisher.js

consumer.js

---

auth-service/

user-service/

---

# Files Created

## constants.js

Stores all messaging constants.

Exchange names

Queue names

Routing keys

Avoids hardcoded strings throughout the project.

---

## rabbitmq.js

Responsible for:

- Creating RabbitMQ connection
- Creating channel
- Reusing existing connection
- Handling connection errors
- Exposing getChannel()

Important Concept:

Only one connection should exist per service.

---

## publisher.js

Responsibilities

- Assert exchange
- Publish events
- Convert object to Buffer
- Mark messages as persistent

Publishing example

Exchange:

user.exchange

Routing Key:

user.created

---

## consumer.js

Responsibilities

- Assert queue
- Bind queue
- Consume messages
- Parse message
- Call handler
- ACK message
- Handle failures

---

## user.consumer.js

Business logic.

Receives:

{
  userId,
  name,
  email
}

Creates profile automatically.

---

## startConsumers.js

Starts all consumers during service startup.

Currently starts:

user.created consumer

Future:

resume.created

job.applied

notification.send

etc.

---

# Startup Flow

Application Starts

↓

Connect MongoDB

↓

Connect RabbitMQ

↓

Start Consumers

↓

Start Express Server

Infrastructure is ready before accepting requests.

---

# Why assertExchange()?

Ensures exchange exists.

Safe to call every startup.

---

# Why assertQueue()?

Creates queue automatically if missing.

---

# Why bindQueue()?

Connects

Exchange

↓

Queue

using Routing Key.

---

# Why Buffer.from()?

RabbitMQ transmits bytes.

JavaScript objects must be converted into buffers.

Publishing

Object

↓

JSON

↓

Buffer

Consumer

Buffer

↓

String

↓

JSON.parse()

↓

Object

---

# Why persistent messages?

Without persistence

RabbitMQ crash

↓

Message lost

With

persistent: true

RabbitMQ stores messages safely.

---

# Why durable queue?

Without durable queue

Broker restart

↓

Queue removed

Durable queue survives restart.

---

# Why ACK?

RabbitMQ removes a message only after receiving acknowledgement.

Process

↓

Success

↓

ACK

↓

Delete message

---

# Why not use noAck?

Automatic acknowledgement may lose messages.

Production systems use manual acknowledgement.

---

# Idempotency

RabbitMQ provides at-least-once delivery.

Meaning

A message may arrive more than once.

Consumer should check:

Does profile already exist?

If yes

Ignore.

Never blindly insert data.

---

# RabbitMQ Dashboard

Management URL

http://localhost:15672

Default Credentials

Username:

admin

Password:

admin123

Dashboard allows monitoring

Connections

Channels

Queues

Exchanges

Consumers

Message rates

---

# Docker

RabbitMQ runs inside Docker.

Docker Compose created:

RabbitMQ Container

Persistent Volume

Bridge Network

Useful Commands

docker compose up -d

docker ps

docker compose down

---

# Current Architecture

                 Client

                    │

                    ▼

              API Gateway

                    │

                    ▼

              Auth Service

                    │

                    ▼

          Publish user.created

                    │

                    ▼

                RabbitMQ

                    │

                    ▼

          user.created.queue

                    │

                    ▼

             User Service

                    │

                    ▼

             Create Profile

---

# Production Benefits

✅ Loose Coupling

Services do not know each other.

---

✅ Scalability

Multiple consumers can process messages.

---

✅ Reliability

RabbitMQ stores messages.

---

✅ Fault Tolerance

Temporary service failures do not stop producers.

---

✅ Extensibility

Tomorrow we can add

Notification Service

Analytics Service

Audit Service

Search Service

without changing Auth Service.

---

# Interview Questions

## Why RabbitMQ?

RabbitMQ provides asynchronous communication between microservices.

It removes tight coupling and improves reliability.

---

## Why use Exchange?

Exchange routes messages to queues.

Producers never send directly to queues.

---

## Why use Routing Keys?

Routing keys allow one exchange to route messages to different queues.

---

## Difference between Queue and Exchange?

Exchange routes messages.

Queue stores messages.

---

## Why manual ACK?

Prevents message loss.

RabbitMQ deletes a message only after successful processing.

---

## What is Idempotency?

Handling duplicate messages safely.

Consumer should always be able to process the same event multiple times without corrupting data.

---

# What We Achieved Today

✅ Docker Installed

✅ RabbitMQ Installed

✅ Docker Compose

✅ RabbitMQ Connection

✅ Publisher

✅ Consumer

✅ Direct Exchange

✅ Queue

✅ Routing Key

✅ Automatic Profile Creation

✅ Event Driven Communication

✅ Removed HTTP dependency between Auth Service and User Service

---

# Next Day Plan (Day 5)

Convert RabbitMQ implementation into a production-ready messaging system.

Topics

- Retry Mechanism
- Dead Letter Queue (DLQ)
- Exponential Backoff
- Message TTL
- Prefetch
- Correlation IDs
- Graceful Shutdown
- Health Checks
- Logging Improvements
- Retry Strategy
- Production Messaging Best Practices

Goal:

Build a messaging infrastructure suitable for large-scale production microservices.