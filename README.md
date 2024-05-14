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

The `LocationPicker.tsx` component is a React component that utilizes the `react-leaflet` library to provide a map interface where users can pick a location by clicking on the map. This component is useful for applications that require users to specify a geographical location, such as event planning apps, location-based services, or user profile settings. Here's a breakdown of its implementation and functionality:

### Component Overview

#### Imports and Setup
```typescript
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
```
- **`react-leaflet`**: This library provides React components for Leaflet maps, making it easy to integrate maps into React applications.
- **`leaflet.css`**: The CSS for Leaflet, which is necessary to ensure the map and its components are styled correctly.
- **React Hooks**: Uses `useEffect` and `useState` for managing state and side effects within the component.

### Key Components

#### Props
- **`center`**: The initial center of the map.
- **`location`**: The initial or current location marker on the map.
- **`onPosition`**: A callback function that is called when the user selects a new location on the map.

#### State Management
- **`position`**: Stores the current position of the marker on the map.
```typescript
const [position, setPosition] = useState(null);

useEffect(() => {
  setPosition(location);
}, [location]);
```
This state is initialized to `null` and updated whenever the `location` prop changes, ensuring the marker reflects the current location.

#### Map Interaction
- **`SelecteLocation` Component**:
```typescript
function SelecteLocation({}) {
  useMapEvent('click', (e) => {
    setPosition(e.latlng);
    onPosition(e.latlng);
  });
  return position ? <Marker position={position} /> : null;
}
```
This functional component handles the map events and updates the marker's position. It uses the `useMapEvent` hook to listen for 'click' events on the map, setting the new position and invoking the `onPosition` callback with the new coordinates.

### Rendering the Map
```typescript
<MapContainer
  style={{
    height: '200px',
    minHeight: '200px',
    width: '100%',
    minWidth: '200px',
    boxSizing: 'border-box',
  }}
  center={center}
  attributionControl={false}
  zoomControl={false}
  zoom={13}
  key={center.toString()}
>
  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png" />
  <SelecteLocation />
</MapContainer>
```
The `MapContainer` sets up the Leaflet map:
- **Styling**: Defines the size and box sizing for the map container.
- **Props**: Disables some controls for a cleaner look and sets zoom level.
- **`TileLayer`**: Specifies the source of map tiles; here, it's using ArcGIS's World Street Map service.
- **`SelecteLocation`**: Injects the component for handling location selection directly into the map.

### Usage
This component can be used in any part of a React application where a user needs to specify a location on a map. The `onPosition` prop allows the parent component to receive updates about the selected location, making it highly versatile and integrated within larger forms or data inputs.

### Conclusion
`LocationPicker` is a functional and reusable component designed for ease of location selection within a React application. It effectively abstracts the complexities of handling map interactions and state management related to geographic data, offering a straightforward interface for both developers and users.
