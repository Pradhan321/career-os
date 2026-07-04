# Day 2 Notes - User Service (CareerOS)

**Date:** July 4, 2026

---

# Objective

Today, I developed the **User Service** of the CareerOS microservices architecture. The focus was on designing a scalable Profile Service instead of creating a simple CRUD application.

---

# What I Implemented

## 1. Profile Model

Created a `Profile` schema using Mongoose.

The profile contains:

* userId
* headline
* bio
* location
* skills
* education
* experience
* socialLinks
* timestamps

---

## 2. Nested Schemas

Instead of storing everything as plain objects, I created separate sub-schemas for:

* Skill
* Education
* Experience
* Social Link

This makes the schema modular, reusable, and easier to maintain.

Example:

```js
skills: [
  {
    name,
    proficiency
  }
]
```

---

## 3. Validation

Implemented Mongoose validations such as:

* required
* enum
* trim
* maxlength
* unique

This prevents invalid data from entering the database.

Example:

```js
proficiency: {
    type: String,
    enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert"
    ]
}
```

Only predefined values are accepted.

---

# Why Enum?

Without an enum, users could store values like:

* Super Expert
* God Level
* ABC
* xyz

Using an enum keeps the database clean and consistent.

---

# Why userId is Unique?

A user should have only one profile.

Relationship:

One User → One Profile

Using:

```js
unique: true
```

ensures MongoDB prevents duplicate profiles for the same user.

---

# Why User Service Stores Only userId?

Authentication data belongs to Auth Service.

Profile data belongs to User Service.

If email were stored in both services, updating the email could create inconsistent data.

Therefore, User Service stores only the `userId` and treats Auth Service as the single source of truth for authentication-related information.

---

# Social Links Design Decision

Initial design:

```js
socialLinks: {
    github,
    linkedin,
    portfolio
}
```

Final design:

```js
socialLinks: [
    {
        platform,
        url
    }
]
```

Reason:

This design is flexible and allows adding platforms like:

* GitHub
* LinkedIn
* LeetCode
* HackerRank
* Codeforces
* Medium
* X (Twitter)
* Any future platform

without modifying the database schema.

---

# APIs Implemented

## Create Profile

```
POST /api/v1/profiles
```

Creates a new profile.

---

## Get Profile

```
GET /api/v1/profiles/:userId
```

Fetches a profile using the userId.

---

## Update Profile

```
PUT /api/v1/profiles/:userId
```

Updates an existing profile.

---

## Delete Profile

```
DELETE /api/v1/profiles/:userId
```

Deletes a profile.

---

## Get All Profiles

```
GET /api/v1/profiles
```

Returns all profiles with pagination support.

---

## Search Profiles by Skill

```
GET /api/v1/profiles/search/skills?skill=React
```

Searches profiles using MongoDB's `$regex` operator.

---

# Pagination

Implemented:

* page
* limit
* skip

Formula:

```js
skip = (page - 1) * limit;
```

Example:

```
GET /api/v1/profiles?page=2&limit=10
```

Returns profiles 11–20.

---

# Why Pagination?

Without pagination:

* Database reads every document.
* Backend uses more memory.
* Response size becomes very large.
* API performance decreases.
* Frontend becomes slow.

Pagination returns only the required subset of data.

---

# Search Using $regex

Implemented:

```js
{
    "skills.name": {
        $regex: skill,
        $options: "i"
    }
}
```

Explanation:

* `$regex` performs pattern matching.
* `"i"` makes the search case-insensitive.

Example:

Searching for:

```
react
```

matches:

* React
* REACT
* react

---

# Learning About Scalability

A CRUD application is not enough for production systems.

To support millions of users, APIs should include:

* Pagination
* Searching
* Filtering
* Sorting
* Indexing
* Authentication
* Authorization
* Proper validation
* Error handling

---

# System Design Concepts Learned

* Microservice separation of responsibilities
* Single Source of Truth
* One-to-One relationship (User → Profile)
* Schema validation
* Data consistency
* Flexible database design
* Nested documents
* API design
* Pagination for scalability
* Search functionality

---

# APIs Tested Successfully

* ✅ Create Profile
* ✅ Get Profile
* ✅ Update Profile
* ✅ Delete Profile
* ✅ Pagination
* ✅ Search by Skill

All APIs are working correctly with MongoDB Atlas.

---

# Interview Questions I Can Answer

* Why use nested schemas?
* Why is `userId` unique?
* Why store only `userId` in User Service?
* What is the Single Source of Truth?
* Why use enums?
* Why implement pagination?
* What are `skip()` and `limit()`?
* Why use `$regex`?
* Why should CRUD APIs include pagination and search?

---

# Next Goals (Day 3)

* MongoDB Indexes
* Global Error Handling
* Advanced Text Search
* Filtering
* Sorting
* Auth Service ↔ User Service Integration
* API Gateway Integration
