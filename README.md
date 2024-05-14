# Neighborhood

## db

config database info in server/.env file

## server

cd server
npm i
node app.js

## server
### App.js
`app.js` serves as the entry point of the application, where the Express server is configured and all routes are defined.

#### Key Components:
- **Express Setup**: Initializes an Express app to manage routing and middleware.
- **Middleware Configuration**:
  - `cors` for handling cross-origin requests.
  - `express.json` for parsing JSON request bodies.
  - `expressjwt` for securing routes with JSON Web Tokens.
  
#### Code Snippet:
```javascript
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
```

### Db.js
`db.js` handles all interactions with the PostgreSQL database using the `pg` module. It provides functions to query and manipulate data related to users, profiles, and addresses.

#### Key Components:
- **Pool Configuration**: Establishes a pool of connections to the database, using environment variables for configuration.
- **Database Functions**: Includes functions for creating users, fetching user details, managing profiles, and addresses.

#### Code Snippet:
```javascript
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.db_user,
  // Other configuration...
});
```

## Security Measures

### Authentication
- **JSON Web Tokens (JWTs)**: Secure routes with JWTs to ensure that users are authenticated for certain operations.
  
#### Code Snippet:
```javascript
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/login", "/reg"] })
);
```

### Password Handling
- **Bcrypt**: Hash passwords before storing them in the database and use bcrypt for comparing hashed passwords during login.

#### Code Snippet:
```javascript
const bcrypt = require("bcrypt");
const hashedPassword = await bcrypt.hash(password, 12);
```

### SQL Injection Protection
- **Parameterized Queries**: All database queries are parameterized to prevent SQL injection.

#### Code Snippet:
```javascript
const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
```

## User Guide

### Setting Up the Environment
1. Install Node.js and npm.
2. Clone the repository and navigate into the project directory.
3. Run `npm install` to install dependencies.
4. Set up environment variables for database access in a `.env` file.

### Starting the Server
Execute `node app.js` to start the server. The server will be available at `http://localhost:3000`.

### API Endpoints
- **Login**: `POST /login` - Authenticate users and return a JWT.
- **Register**: `POST /reg` - Register a new user.
- **User Profile**: `GET /profile` - Retrieve the profile of the authenticated user.

## Future Enhancements
- **OAuth Integration**: Implement OAuth for third-party authentication.
- **Rate Limiting**: Add rate limiting to prevent abuse of the API.

---

This template outlines the critical components of your project. You can expand each section as needed, especially the user guide and future enhancements, based on specific functionalities of your application.
