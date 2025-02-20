# ASP-.NET-WEB-APIs
SpaceManagement (similar to NASA website) - Back (.net apis) + Front (react js)

# SpaceManagement: Web Application for Tracking Celestial Objects

## Description
Welcome to **SpaceManagement**, a web application dedicated to the management of celestial objects! This application allows users to track various objects in our solar system or passing through it, visible from Earth, such as planets, moons, satellites, constellations, comets, spacecraft, and even aliens. The project consists of two APIs for the back-end (CRUD and AUTH) and a front-end interface developed in React (JavaScript).

To get started, download or clone the project via Visual Studio. This project includes:
- A back-end API in .NET for managing celestial objects and authentication via token.
- A front-end interface in React for an interactive and visual user experience.

## Features

### 1. Authentication
- Users must be authenticated to access any features of the application.
- All communication occurs over HTTPS to ensure security.
- Authentication is handled via token-based login (JWT).

### 2. CRUD Operations for Celestial Objects
- **Management of celestial objects**: The system allows for the creation, retrieval, updating, and deletion (CRUD) of celestial objects.
- **Management of trackable objects**: Users can manage objects to be tracked for visibility (naked-eye or through instruments).
- **Notifications**: Users receive notifications when objects are visible at specific times and locations.

### 3. 3D Map Display
- The application includes an interactive 3D map that displays tracked objects in real-time.
- Users can explore the solar system and view celestial objects from Earth.

### 4. API for Document Management
- A back-end API ensures efficient document management and interaction with the data stored in the system.

### 5. Token-Based Authentication (JWT)
- Authentication is done using JSON Web Tokens (JWT) to ensure secure user access.
- Users must be authenticated to perform actions within the app.

### 6. ORM (Entity Framework)
- The application uses Entity Framework for Object-Relational Mapping (ORM) to manage data.
- This ensures smooth data operations and a consistent layer for managing the application’s data.

### 7. Layered Architecture (BLL, DTO, DAL, etc.)
- The back-end follows a layered architecture pattern, with distinct layers such as:
  - **BLL (Business Logic Layer)**: Manages the business logic.
  - **DTO (Data Transfer Object)**: Facilitates data transfer between layers.
  - **DAL (Data Access Layer)**: Handles interactions with the database.

### 8. Decoupling
- The application is designed with decoupling in mind, ensuring that the back-end and front-end are loosely coupled. This makes the system more modular and easier to maintain.

### 9. Microsoft Database
- The application uses a Microsoft SQL Server database to store and manage data related to celestial objects and user information.

## Installation

### Prerequisites
- .NET for the back-end API
- React for the front-end
- SQL Server for the database