# OnlineJobPortal Backend

This is the backend of the **OnlineJobPortal** application, a platform for job seekers and employers to connect, post and apply for jobs, and communicate via a real-time chat system.

## Features

- **User Authentication:** Register, login, and authenticate users using JWT.
- **Role-Based Access Control:** Separate functionalities for job seekers and employers.
- **Job Postings:** Employers can create and manage job postings.
- **Job Applications:** Job seekers can apply for jobs, and employers can manage applications.
- **Real-Time Chat:** Messaging system for job seekers and employers.

## Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database to store and manage data.
- **Mongoose:** ODM for MongoDB, allowing easy data interaction.
- **Socket.io:** Real-time, bidirectional communication between clients and servers.
- **JWT:** JSON Web Tokens for secure authentication.
- **Express Validator:** Middleware for validating and sanitizing request data.
- **BCrypt:** Library for hashing and comparing passwords.
- **Cors:** Middleware to enable Cross-Origin Resource Sharing.
- **Dotenv:** Environment variable management.
- **Nodemon:** Utility to automatically restart the server on code changes.

## Installation

### Prerequisites

- **Node.js** and **npm** should be installed on your system.
- A **MongoDB** instance should be running (either locally or in the cloud).

#### Steps

1. **Clone the Repository:**

   `git clone https://github.com/your-username/OnlineJobPortal.git`

2. **Navigate to the Backend Directory:**

   `cd OnlineJobPortal/backend`

3. **Install Dependencies:**
   `npm install`

4. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)) .

5. **Start the Server:**

   `npm start`

   The server will run on http://localhost:5000 by default.

## Environment Variables

Add a `.env` file in the root of your backend directory with the following keys:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGINS = "http://localhost:3000"
```

- `PORT:` The port the server will listen on.
- `MONGO_URI:` MongoDB connection string.
- `JWT_SECRET:` Secret key for signing JWT tokens.
- `ALLOWED_ORIGINS:` URL for allowed origins (e.g., your frontend app).

## Frontend Repository

The frontend of this project is available at [NextJs-OnlineJobPortal](https://github.com/SobalWork/NextJs-OnlineJobPortal). It is built using Next.js and connects to this backend to provide a seamless user experience.

### By Sobal

Connect with me on [LinkedIn](https://www.linkedin.com/in/sobal-tariq-308316204/).
