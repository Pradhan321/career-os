# API Endpoints

## Auth Service

### Register

POST

```
/api/auth/register
```

### Login

POST

```
/api/auth/login
```

### Profile

GET

```
/api/auth/profile
```

Requires JWT.

---

## User Service

### Create Profile

POST

```
/api/profiles
```

### Get Profile

GET

```
/api/profiles/:userId
```

### Update Profile

PUT

```
/api/profiles/:userId
```

### Delete Profile

DELETE

```
/api/profiles/:userId
```

### Search by Skill

GET

```
/api/profiles/search/skills
```

Example

```
?skill=React
```

### Text Search

GET

```
/api/profiles/search
```

Example

```
?query=frontend
```

### Filter Profiles

GET

```
/api/profiles/filter
```