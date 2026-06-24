# Day 1 - Auth Service Foundation

## Date

24 June 2026

---

# Goal

Build the Authentication Service for CareerOS using Node.js, Express.js, MongoDB, JWT, and bcrypt.

---

# Features Implemented

## User Registration

Implemented user registration API:

```http
POST /api/v1/auth/register
```

Responsibilities:

* Accept user details
* Validate duplicate email
* Hash password
* Store user in MongoDB
* Generate JWT token

---

## User Login

Implemented login API:

```http
POST /api/v1/auth/login
```

Responsibilities:

* Verify email exists
* Compare password using bcrypt
* Generate JWT token
* Return authentication token

---

## Protected Route

Implemented profile API:

```http
GET /api/v1/auth/profile
```

Responsibilities:

* Verify JWT token
* Identify current user
* Return user profile information
* Exclude password field

---

# Project Structure

```text
auth-service/

src/

├── config/
│   └── db.js
│
├── controllers/
│   └── auth.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── rateLimiter.middleware.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── auth.routes.js
│
├── utils/
│   └── generateToken.js
│
├── app.js
│
└── server.js
```

---

# Concepts Learned

## Authentication

Authentication answers:

"Who are you?"

User provides credentials and proves identity.

Example:

* Login
* JWT Verification

---

## Authorization

Authorization answers:

"What are you allowed to do?"

Examples:

* Admin
* User
* Recruiter

Authorization will be implemented later using RBAC.

---

## JWT Authentication

JWT is a stateless authentication mechanism.

Workflow:

1. User logs in.
2. Server verifies credentials.
3. Server generates JWT.
4. Client stores JWT.
5. Client sends JWT with every request.
6. Server validates JWT and identifies user.

---

## Why JWT is Stateless

The server does not store session information.

All necessary identification data is stored inside the token.

Any backend server can validate the token independently.

This makes JWT suitable for distributed systems and microservices.

---

## Password Hashing

Passwords should never be stored as plain text.

Implemented using bcrypt.

Benefits:

* Protects users if database is compromised.
* Uses salting to strengthen security.
* Makes passwords difficult to reverse.

---

## Mongoose Middleware

Implemented:

```javascript
userSchema.pre("save")
```

Purpose:

* Automatically hash password before saving.
* Keep password logic inside model layer.

This follows separation of concerns.

---

## Rate Limiting

Implemented using:

```javascript
express-rate-limit
```

Purpose:

* Protect login endpoint
* Prevent brute-force attacks
* Reduce abuse

---

## Helmet

Implemented:

```javascript
helmet()
```

Purpose:

* Add security headers
* Improve API security
* Protect against common web vulnerabilities

---

## Morgan

Implemented:

```javascript
morgan("dev")
```

Purpose:

* Request logging
* Debugging
* Monitoring

---

# Bug Faced

## Error

```text
TypeError: next is not a function
```

Location:

```javascript
userSchema.pre("save")
```

---

## Root Cause

Used async middleware together with next().

Example:

```javascript
userSchema.pre("save", async function (next) {
  ...
  next();
});
```

In modern Mongoose versions, async middleware automatically returns a Promise.

Calling next() is unnecessary.

---

## Fix

Updated middleware:

```javascript
userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});
```

---

# APIs Tested

## Register

```http
POST /api/v1/auth/register
```

Status:

```text
201 Created
```

---

## Login

```http
POST /api/v1/auth/login
```

Status:

```text
200 OK
```

---

## Profile

```http
GET /api/v1/auth/profile
```

Status:

```text
200 OK
```

---

# Interview Questions Learned

### Why use bcrypt?

To hash passwords before storing them in the database.

---

### Why use JWT?

To implement stateless authentication.

---

### Why store only userId in JWT?

To keep the token small and avoid exposing sensitive information.

---

### Why use select("-password")?

To prevent sending password hashes to clients.

---

### Difference Between 401 and 403

401:

User is not authenticated.

403:

User is authenticated but does not have permission.

---

# Key Takeaways

Today I built a complete Authentication Service including:

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Password Hashing
* Security Middleware
* Request Logging
* Rate Limiting
* MongoDB Integration

I also debugged a real-world Mongoose middleware issue and learned the difference between callback-based middleware and async middleware.
